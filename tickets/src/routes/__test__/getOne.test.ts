import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(404);
});

it('returns the ticket if the ticket is found', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 10,
    userId: '123',
  }).save();

  const res = await request(app)
    .get(`/api/tickets/${ticket._id}`)
    .set('Cookie', signin())
    .send();

  expect(res.status).toEqual(200);
  expect(res.body).toMatchObject(ticket.toJSON());
});
