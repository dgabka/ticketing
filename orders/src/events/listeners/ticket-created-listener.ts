import {
  NatsListener,
  Subjects,
  TicketCreatedEvent,
} from '@dg-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketCreatedListener extends NatsListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage = async (data: TicketCreatedEvent['data'], msg: Message) => {
    const { id, title, price } = data;
    await Ticket.build({
      id,
      title,
      price,
    }).save();

    msg.ack();
  };
}
