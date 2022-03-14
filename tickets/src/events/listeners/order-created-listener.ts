import {
  NatsListener,
  OrderCreatedEvent,
  Subjects,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedPublisher } from '../';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCreatedListener extends NatsListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage: (data: OrderCreatedEvent['data'], msg: Message) => Promise<void> =
    async (data, msg) => {
      const {
        id: orderId,
        ticket: { id: ticketId },
      } = data;

      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      ticket.set({ orderId });

      await ticket.save();

      new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version,
      });

      msg.ack();
    };
}
