import { Event, NatsListener } from '@dg-ticketing/common';
import { OrderCancelledListener } from './listeners/order-cancelled-listener';
import { OrderCreatedListener } from './listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const listeners: Array<NatsListener<Event>> = [];

export const initListeners = () => {
  listeners.push(new OrderCreatedListener(natsWrapper.client));
  listeners.push(new OrderCancelledListener(natsWrapper.client));
  listeners.forEach((l) => l.listen());
  console.log('Listeners initialized');
};

export * from './publishers/ticket-created-publisher';
export * from './publishers/ticket-updated-publisher';
export { natsWrapper };
