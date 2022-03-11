export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
  OrderUpdated = 'order:updated',
}

export interface Event {
  subject: Subjects;
  data: any;
}

export interface TicketCreatedEvent extends Event {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

export interface TicketUpdatedEvent extends Event {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
