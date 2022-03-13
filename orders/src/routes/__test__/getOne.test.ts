import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@dg-ticketing/common';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(404);
});

it('should return 401 Not Authorized if user does not own the order', async () => {
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
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(401);
  expect(res.body).toMatchObject({
    errors: [{ message: 'Not Authorized' }],
  });
});

it('returns the ticket if the ticket is found', async () => {
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
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(200);
  expect(res.body).toMatchObject(order.toJSON());
});
