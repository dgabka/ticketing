import IORedis from 'ioredis';

export const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
