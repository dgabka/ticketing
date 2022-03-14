import { Queue, QueueScheduler } from 'bullmq';
import {
  OrderExpirationQueuePayload,
  ORDER_EXPIRATION_QUEUE_NAME,
} from './common';
import { connection } from './connection';

const expirationQueue = new Queue<OrderExpirationQueuePayload>(
  ORDER_EXPIRATION_QUEUE_NAME,
  {
    connection,
  }
);

const queueScheduler = new QueueScheduler(ORDER_EXPIRATION_QUEUE_NAME, {
  connection,
});

export { expirationQueue };
