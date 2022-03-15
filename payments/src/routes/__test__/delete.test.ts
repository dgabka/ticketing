import { OrderStatus } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../events';
import { Order } from '../../models/order';
import { Ticket, TicketDoc } from '../../models/ticket';

const id = new mongoose.Types.ObjectId().toHexString();
const path = '/api/orders';

let ticket: TicketDoc;

beforeEach(async () => {
  ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'title',
    price: 10,
  }).save();
});

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
  const order = await Order.build({
    ticket,
    userId: '1',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  }).save();

  await request(app)
    .delete(`${path}/${order.id}`)
    .set('Cookie', signin())
    .send();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
