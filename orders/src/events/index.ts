import { Event, NatsListener } from '@dg-ticketing/common';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './listeners/ticket-created-listener';
import { TicketUpdatedListener } from './listeners/ticket-updated-listener';

const listeners: Array<NatsListener<Event>> = [];

export const initListeners = () => {
  listeners.push(new TicketCreatedListener(natsWrapper.client));
  listeners.push(new TicketUpdatedListener(natsWrapper.client));
  listeners.forEach((l) => l.listen());
  console.log('Listeners initialized');
};
