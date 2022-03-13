import {
  NatsListener,
  Subjects,
  TicketUpdatedEvent,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketUpdatedListener extends NatsListener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage = async (data: TicketUpdatedEvent['data'], msg: Message) => {
    console.log(JSON.stringify(data));
    const { id, title, price } = data;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  };
}
