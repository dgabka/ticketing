import { TicketCreatedEvent } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

let listener: TicketCreatedListener;

const data: TicketCreatedEvent['data'] = {
  id: new mongoose.Types.ObjectId().toHexString(),
  price: 10,
  title: 'concert',
  userId: new mongoose.Types.ObjectId().toHexString(),
  version: 0,
};
// @ts-ignore
const message: Message = {
  ack: jest.fn(),
};

beforeEach(async () => {
  listener = new TicketCreatedListener(natsWrapper.client);
});

it('should create a ticket', async () => {
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
