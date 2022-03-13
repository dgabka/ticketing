import { OrderStatus } from '@dg-ticketing/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('can fetch a list of orders', async () => {
  const tickets = await Promise.all([
    Ticket.build({
      title: 'title',
      price: 10,
    }).save(),
    Ticket.build({
      title: 'title',
      price: 10,
    }).save(),
    Ticket.build({
      title: 'title',
      price: 10,
    }).save(),
  ]);
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
