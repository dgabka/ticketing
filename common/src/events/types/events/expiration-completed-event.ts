import { Subjects } from '../enums';

export interface ExpirationCompleteEvent extends Event {
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
