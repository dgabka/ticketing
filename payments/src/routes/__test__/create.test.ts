import { OrderStatus } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../events';
import { Order, OrderDoc } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import { genId } from '../../test/utils';

jest.mock('../../stripe');

const path = '/api/payments';

let order: OrderDoc;
const userId = genId();

beforeEach(async () => {
  order = await Order.build({
    status: OrderStatus.Created,
    userId,
    price: 10,
    id: genId(),
    version: 0,
  }).save();
});

it('can only be accessed if the user is signed in', async () => {
  const res = await request(app).post(path).send({
    orderId: order.id,
  });

  expect(res.status).toEqual(401);
});

it('should return an error if order is not found', async () => {
  const res = await request(app).post(path).set('Cookie', signin(userId)).send({
    orderId: genId(),
  });

  expect(res.status).toEqual(404);
  expect(res.body).toMatchObject({
    errors: [{ message: 'Not found' }],
  });
});

it('should return an error if user does not own the order', async () => {
  const res = await request(app)
    .post(path)
    .set('Cookie', signin(genId()))
    .send({
      orderId: order.id,
    });

  expect(res.status).toEqual(401);
});

it('should return an error if order is cancelled', async () => {
  order.set('status', OrderStatus.Cancelled);
  await order.save();

  const res = await request(app).post(path).set('Cookie', signin(userId)).send({
    orderId: order.id,
  });

  expect(res.status).toEqual(400);
});

it('should call stripe api', async () => {
  const res = await request(app).post(path).set('Cookie', signin(userId)).send({
    orderId: order.id,
    token: 'tok_visa',
  });

  expect(res.status).toEqual(201);
  expect(stripe.charges.create).toHaveBeenCalledWith({
    currency: 'usd',
    amount: order.price,
    source: 'tok_visa',
  });
});

it('should create payment', async () => {
  const res = await request(app).post(path).set('Cookie', signin(userId)).send({
    orderId: order.id,
    token: 'tok_visa',
  });

  expect(res.status).toEqual(201);
  await expect(
    Payment.findOne({
      orderId: order.id,
      stripeId: '12345',
    })
  ).resolves.not.toBeNull();
});

// it('should publish an event', async () => {
//   await request(app).post(path).set('Cookie', signin()).send({
//   });

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
