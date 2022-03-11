import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../events/nats-wrapper';

const id = new mongoose.Types.ObjectId().toHexString();

it('returns a 404 if provided id does not exits', async () => {
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'title',
      price: 20,
    });

  expect(res.status).toEqual(404);
});

it('returns 401 if user is not authenticated', async () => {
  const res = await request(app).put(`/api/tickets/${id}`).send({
    title: 'title',
    price: 20,
  });

  expect(res.status).toEqual(401);
});

it('return 401 if user does not own a ticket', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
    userId: '123',
  }).save();

  const res = await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set('Cookie', signin())
    .send({
      title: 'title',
      price: 20,
    });

  expect(res.status).toEqual(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
    userId: '1',
  }).save();

  let res = await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set('Cookie', signin())
    .send({
      title: 'new title',
      price: -20,
    });
  expect(res.status).toEqual(400);

  res = await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set('Cookie', signin())
    .send({
      title: '',
      price: 20,
    });
  expect(res.status).toEqual(400);
});

it('returns updated ticket with valid inputs', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
    userId: '1',
  }).save();

  const ticketUpdate = {
    title: 'new title',
    price: 30,
  };

  let res = await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set('Cookie', signin())
    .send(ticketUpdate);
  expect(res.status).toEqual(200);
  expect(res.body).toMatchObject(ticketUpdate);
});

it('should publish an event', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
    userId: '1',
  }).save();

  const ticketUpdate = {
    title: 'new title',
    price: 30,
  };

  let res = await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set('Cookie', signin())
    .send(ticketUpdate);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
