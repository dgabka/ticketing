import { Subjects } from '../enums';

export interface Event {
  subject: Subjects;
  data: any;
}
