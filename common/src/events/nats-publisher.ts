import { Stan } from 'node-nats-streaming';
import { Event } from './types';

export abstract class NatsPublisher<T extends Event> {
  abstract readonly subject: T['subject'];

  constructor(private client: Stan) {}

  publish(data: T['data']) {
    this.client.publish(this.subject, JSON.stringify(data), () => {
      console.log(`Event published to: '${this.subject.toString()}'`);
    });
  }
}
