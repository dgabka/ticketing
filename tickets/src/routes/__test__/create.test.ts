import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../events';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).toEqual(401);
});

it('returns status other that 401 if user is signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({});

  expect(res.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: '',
      price: 10,
    });

  expect(res.status).toEqual(400);
});

it('returns an error if an invalid price is provided', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'title',
      price: -10,
    });

  expect(res.status).toEqual(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const ticket = {
    title: 'title',
    price: 10,
  };

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send(ticket);

  expect(res.status).toEqual(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0]).toMatchObject(ticket);
});

it('should publish an event', async () => {
  const ticket = {
    title: 'title',
    price: 10,
  };

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send(ticket);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
