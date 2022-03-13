import {
  NatsPublisher,
  Subjects,
  OrderCancelledEvent,
} from '@dg-ticketing/common';

export class OrderCancelledPublisher extends NatsPublisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
