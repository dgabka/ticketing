import { Event, NatsListener } from '@dg-ticketing/common';
import { ExpirationCompleteListener } from './listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './listeners/payment-created-listener';
import { TicketCreatedListener } from './listeners/ticket-created-listener';
import { TicketUpdatedListener } from './listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';

const listeners: Array<NatsListener<Event>> = [];

export const initListeners = () => {
  listeners.push(new TicketCreatedListener(natsWrapper.client));
  listeners.push(new TicketUpdatedListener(natsWrapper.client));
  listeners.push(new ExpirationCompleteListener(natsWrapper.client));
  listeners.push(new PaymentCreatedListener(natsWrapper.client));
  listeners.forEach((l) => l.listen());
  console.log('Listeners initialized');
};

export * from './publishers/order-cancelled-publisher';
export * from './publishers/order-created-publisher';
export { natsWrapper };
