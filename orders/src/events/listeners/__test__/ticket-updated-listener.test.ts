import { TicketUpdatedEvent } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

let listener: TicketUpdatedListener;

const data: TicketUpdatedEvent['data'] = {
  id: new mongoose.Types.ObjectId().toHexString(),
  price: 10,
  title: 'concert',
  userId: new mongoose.Types.ObjectId().toHexString(),
  version: 1,
};
// @ts-ignore
const message: Message = {
  ack: jest.fn(),
};

beforeEach(async () => {
  await Ticket.build({
    id: data.id,
    price: 5,
    title: 'movie',
  }).save();
  listener = new TicketUpdatedListener(natsWrapper.client);
});

it('should update a ticket', async () => {
  await listener.onMessage(data, message);
  await expect(Ticket.findById(data.id)).resolves.toMatchObject({
    id: data.id,
    price: data.price,
    title: data.title,
  });
});

it('should acknowledge the event', async () => {
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

it('should throw an error when out or order event received', async () => {
  await expect(
    listener.onMessage({ ...data, version: 5 }, message)
  ).rejects.toThrowError();
  expect(message.ack).not.toHaveBeenCalled();
});
