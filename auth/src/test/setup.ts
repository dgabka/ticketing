import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signup: () => Promise<string[]>;
}

global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testkey';
  mongo = await MongoMemoryServer.create();
  const mongoURI = await mongo.getUri();
  await mongoose.connect(mongoURI);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await Promise.all([mongo.stop(), mongoose.connection.close()]);
});
