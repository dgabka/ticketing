import {
  NatsListener,
  OrderCancelledEvent,
  Subjects,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedPublisher } from '../';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class OrderCancelledListener extends NatsListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage: (
    data: OrderCancelledEvent['data'],
    msg: Message
  ) => Promise<void> = async (data, msg) => {
    const {
      ticket: { id },
    } = data;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: null });

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
