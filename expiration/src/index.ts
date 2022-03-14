import { initListeners, natsWrapper } from './events';

const start = async () => {
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
  } catch (e) {
    console.error(e);
  }
};

start();

const close = () => {
  natsWrapper.close();
  process.exit();
};

process.on('SIGINT', close);
process.on('SIGTERM', close);
