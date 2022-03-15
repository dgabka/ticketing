import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@dg-ticketing/common';
import express, { Request, Response } from 'express';
import { natsWrapper, OrderCancelledPublisher } from '../events';
import { Order } from '../models/order';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
