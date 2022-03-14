import { Event, NatsListener } from '@dg-ticketing/common';
import { OrderCreatedListener } from './listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const listeners: Array<NatsListener<Event>> = [];

export const initListeners = () => {
  listeners.push(new OrderCreatedListener(natsWrapper.client));
  listeners.forEach((l) => l.listen());
  console.log('Listeners initialized');
};

export * from './publishers/expiration-complete-publisher';
export { natsWrapper };
