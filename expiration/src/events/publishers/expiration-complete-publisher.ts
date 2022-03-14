import {
  ExpirationCompleteEvent,
  NatsPublisher,
  Subjects,
} from '@dg-ticketing/common';

export class ExpirationCompletePublisher extends NatsPublisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
