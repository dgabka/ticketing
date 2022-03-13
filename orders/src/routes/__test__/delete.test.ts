import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@dg-ticketing/common';
import { natsWrapper } from '../../events/nats-wrapper';

const id = new mongoose.Types.ObjectId().toHexString();
const path = '/api/orders';

it('returns a 404 if provided id does not exits', async () => {
  const res = await request(app)
    .delete(`${path}/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'title',
      price: 20,
    });

  expect(res.status).toEqual(404);
});

it('returns 401 if user is not authenticated', async () => {
  const res = await request(app).delete(`${path}/${id}`).send({
    title: 'title',
    price: 20,
  });

  expect(res.status).toEqual(401);
});

it('should return 401 if user does not own a order', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
  }).save();
  const order = await Order.build({
    ticket,
    userId: '2',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  }).save();

  const res = await request(app)
    .delete(`${path}/${order.id}`)
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(401);
  expect(res.body).toMatchObject({
    errors: [{ message: 'Not Authorized' }],
  });
});

it('should cancel an order', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
  }).save();
  const order = await Order.build({
    ticket,
    userId: '1',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  }).save();

  const res = await request(app)
    .delete(`${path}/${order.id}`)
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(200);
  expect(res.body.status).toEqual(OrderStatus.Cancelled.toString());
});

it('should publish an event', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
  }).save();
  const order = await Order.build({
    ticket,
    userId: '1',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  }).save();

  const res = await request(app)
    .delete(`${path}/${order.id}`)
    .set('Cookie', signin())
    .send();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
