import {
  NatsListener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class PaymentCreatedListener extends NatsListener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage = async (data: PaymentCreatedEvent['data'], msg: Message) => {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  };
}
