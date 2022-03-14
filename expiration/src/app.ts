import { currentUser, errorHandler, NotFoundError } from '@dg-ticketing/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { createOrderRouter } from './routes/create';
import { deleteOrderRouter } from './routes/delete';
import { getAllOrderRouter } from './routes/getAll';
import { getOneOrderRouter } from './routes/getOne';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createOrderRouter);
app.use(getOneOrderRouter);
app.use(getAllOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req) => {
  console.error(req.path);
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
