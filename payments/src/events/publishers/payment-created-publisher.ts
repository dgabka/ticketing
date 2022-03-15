import {
  NatsPublisher,
  PaymentCreatedEvent,
  Subjects,
} from '@dg-ticketing/common';

export class PaymentCreatedPublisher extends NatsPublisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
