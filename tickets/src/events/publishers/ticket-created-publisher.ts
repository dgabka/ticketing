import {
  NatsPublisher,
  Subjects,
  TicketCreatedEvent,
} from '@dg-ticketing/common';

export class TicketCreatedPublisher extends NatsPublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
