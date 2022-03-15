import {
  NatsListener,
  OrderCreatedEvent,
  Subjects,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage: (data: OrderCreatedEvent['data'], msg: Message) => Promise<void> =
    async (data, msg) => {
      await Order.build({
        ...data,
        price: data.ticket.price,
      }).save();

      msg.ack();
    };
}
