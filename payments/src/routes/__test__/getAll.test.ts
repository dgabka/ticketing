import { OrderStatus } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket, TicketDoc } from '../../models/ticket';

let tickets: Array<TicketDoc>;

beforeEach(async () => {
  tickets = await Promise.all([
    Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'title',
      price: 10,
    }).save(),
    Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'title',
      price: 10,
    }).save(),
    Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'title',
      price: 10,
    }).save(),
  ]);
});

it('can fetch a list of orders', async () => {
  const orders = await Promise.all(
    tickets.map((ticket, index) =>
      Order.build({
        ticket,
        userId: `${(index % 2) + 1}`,
        status: OrderStatus.Created,
        expiresAt: new Date(),
      }).save()
    )
  );

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(200);
  expect(res.body).toMatchObject(
    orders.filter(({ userId }) => userId === '1').map((order) => order.toJSON())
  );
});
