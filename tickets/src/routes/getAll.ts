import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@dg-ticketing/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.status(200).send(tickets);
});

export { router as getAllTicketRouter };
