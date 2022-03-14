export const ORDER_EXPIRATION_QUEUE_NAME = 'order:expiration';

export interface OrderExpirationQueuePayload {
  orderId: string;
}
