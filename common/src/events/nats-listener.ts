import { Stan, Message } from 'node-nats-streaming';
import { Event, Subjects } from './types';

export abstract class NatsListener<T extends Event> {
  abstract readonly subject: T['subject'];
  abstract readonly queueGroupName: string;
  abstract onMessage: (data: T['data'], msg: Message) => void;
  protected ackWait = 5 * 1000;

  constructor(private client: Stan) {}

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
