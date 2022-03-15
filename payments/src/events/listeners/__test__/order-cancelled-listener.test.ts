import { OrderCancelledEvent, OrderStatus } from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order, OrderDoc } from '../../../models/order';
import { genId } from '../../../test/utils';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

let listener: OrderCancelledListener;
let order: OrderDoc;
let data: OrderCancelledEvent['data'];

// @ts-ignore
const message: Message = {
  ack: jest.fn(),
};

beforeEach(async () => {
  listener = new OrderCancelledListener(natsWrapper.client);
  order = await Order.build({
    id: genId(),
    userId: genId(),
    status: OrderStatus.Created,
    price: 10,
    version: 0,
  }).save();
  data = {
    id: order.id,
    ticket: { id: genId() },
    version: 1,
  };
});

it('should update order status', async () => {
  await listener.onMessage(data, message);
  await expect(Order.findById(order.id)).resolves.toHaveProperty(
    'status',
    OrderStatus.Cancelled.toString()
  );
});

it('should acknowledge the event', async () => {
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
