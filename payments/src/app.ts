import { currentUser, errorHandler, NotFoundError } from '@dg-ticketing/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { createChargeRouter } from './routes/create';

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

app.use(createChargeRouter);

app.all('*', async (req) => {
  console.error(req.path);
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
