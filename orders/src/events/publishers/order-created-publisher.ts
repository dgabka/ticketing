import {
  NatsPublisher,
  OrderCreatedEvent,
  Subjects,
} from '@dg-ticketing/common';

export class OrderCreatedPublisher extends NatsPublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
