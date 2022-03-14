import { OrderCancelledEvent } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../';
import { Ticket, TicketDoc } from '../../../models/ticket';
import { OrderCancelledListener } from '../order-cancelled-listener';

let listener: OrderCancelledListener;
let ticket: TicketDoc;

let data: OrderCancelledEvent['data']; // @ts-ignore
const message: Message = {
  ack: jest.fn(),
};

beforeEach(async () => {
  ticket = await Ticket.build({
    title: 'movie',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }).save();
  listener = new OrderCancelledListener(natsWrapper.client);
  data = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
  };
});

it('should remove order id', async () => {
  await listener.onMessage(data, message);
  await expect(Ticket.findById(ticket.id)).resolves.toHaveProperty(
    'orderId',
    null
  );
});

it('should acknowledge the event', async () => {
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

it('should throw an error if ticket is not found', async () => {
  data.ticket.id = new mongoose.Types.ObjectId().toHexString();
  await expect(listener.onMessage(data, message)).rejects.toThrowError();
});

it('should publish a ticket updated event', async () => {
  await listener.onMessage(data, message);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const arg = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(arg.id).toEqual(data.ticket.id);
  expect(arg.orderId).toEqual(null);
});
