import { OrderStatus } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../events';
import { Order } from '../../models/order';
import { Ticket, TicketDoc } from '../../models/ticket';

const path = '/api/orders';

let ticket: TicketDoc;

beforeEach(async () => {
  ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'title',
    price: 10,
  }).save();
});

it('can only be accessed if the user is signed in', async () => {
  const res = await request(app).post(path).send({});

  expect(res.status).toEqual(401);
});

it('should return an error if ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app).post(path).set('Cookie', signin()).send({
    ticketId,
  });

  expect(res.status).toEqual(404);
  expect(res.body).toMatchObject({
    errors: [{ message: 'Not found' }],
  });
});

it('should return an error if ticket is reserved', async () => {
  await Order.build({
    ticket,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
  }).save();

  const res = await request(app).post(path).set('Cookie', signin()).send({
    ticketId: ticket._id,
  });

  expect(res.status).toEqual(400);
  expect(res.body).toMatchObject({
    errors: [{ message: 'Ticket is already reserved' }],
  });
});

it('returns an error if an invalid price is provided', async () => {
  const res = await request(app).post(path).set('Cookie', signin()).send({
    price: -10,
  });

  expect(res.status).toEqual(400);
});

it('creates a order with valid inputs', async () => {
  let orders = await Order.find({});
  expect(orders.length).toEqual(0);

  const res = await request(app).post(path).set('Cookie', signin()).send({
    ticketId: ticket._id,
  });

  expect(res.status).toEqual(201);

  orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0]).toMatchObject({
    userId: '1',
    ticket: ticket._id,
    status: OrderStatus.Created,
  });
  await expect(ticket.isReserved()).resolves.toBe(true);
});

it('should publish an event', async () => {
  await request(app).post(path).set('Cookie', signin()).send({
    ticketId: ticket._id,
  });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
