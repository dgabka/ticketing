import {
  NatsListener,
  OrderCreatedEvent,
  Subjects,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage: (data: OrderCreatedEvent['data'], msg: Message) => Promise<void> =
    async (data, msg) => {
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
      await expirationQueue.add(
        'order:created',
        {
          orderId: data.id,
        },
        {
          delay,
        }
      );

      msg.ack();
    };
}
