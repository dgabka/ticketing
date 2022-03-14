import { ExpirationCompleteEvent, OrderStatus } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order, OrderDoc } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

let listener: ExpirationCompleteListener;
let order: OrderDoc;
let data: ExpirationCompleteEvent['data'];

// @ts-ignore
const message: Message = {
  ack: jest.fn(),
};

beforeEach(async () => {
  listener = new ExpirationCompleteListener(natsWrapper.client);
  order = await Order.build({
    ticket: await Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
      title: 'movie',
    }).save(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }).save();
  data = {
    orderId: order.id,
  };
});

it('should create a ticket', async () => {
  await listener.onMessage(data, message);
  await expect(Order.findById(data.orderId)).resolves.toHaveProperty(
    'status',
    OrderStatus.Cancelled.toString()
  );
});

it('should acknowledge the event', async () => {
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

it('should publish order cancelled event', async () => {
  await listener.onMessage(data, message);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const dataArg = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  expect(JSON.parse(dataArg)).toMatchObject({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });
});
