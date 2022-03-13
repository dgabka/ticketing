import mongoose from 'mongoose';

import { app } from './app';
import { initListeners } from './events';
import { natsWrapper } from './events/nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    initListeners();
    await mongoose.connect(process.env.MONGO_URI);
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();

const close = () => {
  natsWrapper.close();
  process.exit();
};

process.on('SIGINT', close);
process.on('SIGTERM', close);
