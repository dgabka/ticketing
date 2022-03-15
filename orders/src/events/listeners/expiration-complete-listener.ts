import {
  ExpirationCompleteEvent,
  NatsListener,
  OrderStatus,
  Subjects,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class ExpirationCompleteListener extends NatsListener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage = async (data: ExpirationCompleteEvent['data'], msg: Message) => {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found error');
    }

    if (order.status === OrderStatus.Complete) {
      throw new Error('Order already complete');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
      id: order.id,
    });

    msg.ack();
  };
}
