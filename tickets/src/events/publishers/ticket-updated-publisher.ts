import {
  NatsPublisher,
  Subjects,
  TicketUpdatedEvent,
} from '@dg-ticketing/common';

export class TicketUpdatedPublisher extends NatsPublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
