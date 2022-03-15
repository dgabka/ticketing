import {
  NatsListener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@dg-ticketing/common';
import { verify } from 'jsonwebtoken';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage: (
    data: OrderCancelledEvent['data'],
    msg: Message
  ) => Promise<void> = async (data, msg) => {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    msg.ack();
  };
}
