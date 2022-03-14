import { Job, Worker } from 'bullmq';
import { ExpirationCompletePublisher, natsWrapper } from '../events';
import {
  OrderExpirationQueuePayload,
  ORDER_EXPIRATION_QUEUE_NAME,
} from './common';
import { connection } from './connection';

const worker = new Worker<OrderExpirationQueuePayload>(
  ORDER_EXPIRATION_QUEUE_NAME,
  async (job: Job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
  },
  { connection }
);
