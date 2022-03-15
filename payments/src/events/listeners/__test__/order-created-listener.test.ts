import { OrderCreatedEvent, OrderStatus } from '@dg-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { genId } from '../../../test/utils';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

let listener: OrderCreatedListener;

const data: OrderCreatedEvent['data'] = {
  id: genId(),
  userId: genId(),
  status: OrderStatus.Created,
  expiresAt: new Date().toISOString(),
  ticket: {
    id: genId(),
    price: 10,
  },
  version: 0,
};
// @ts-ignore
const message: Message = {
  ack: jest.fn(),
};

beforeEach(async () => {
  listener = new OrderCreatedListener(natsWrapper.client);
});

it('should create an order', async () => {
  await listener.onMessage(data, message);
  await expect(Order.findById(data.id)).resolves.toMatchObject({
    id: data.id,
    price: data.ticket.price,
    status: data.status,
    userId: data.userId,
  });
});

it('should acknowledge the event', async () => {
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
