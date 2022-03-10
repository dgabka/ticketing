import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('can fetch a list of tickets', async () => {
  const tickets = await Promise.all([
    Ticket.build({
      title: 'title',
      price: 10,
      userId: '123',
    }).save(),
    Ticket.build({
      title: 'title 2',
      price: 15,
      userId: '321',
    }).save(),
    Ticket.build({
      title: 'title 3',
      price: 20,
      userId: '111',
    }).save(),
  ]);

  const res = await request(app).get('/api/tickets').send();
  expect(res.status).toEqual(200);
});
