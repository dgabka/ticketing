import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { genId } from './utils';

declare global {
  var signin: (id?: string) => string[];
}

global.signin = (id?: string) => {
  const payload = {
    id: id ?? genId(),
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};

let mongo: any;

jest.mock('../events/nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'testkey';
  mongo = await MongoMemoryServer.create();
  const mongoURI = await mongo.getUri();
  await mongoose.connect(mongoURI);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
  jest.clearAllMocks();
});

afterAll(async () => {
  await Promise.all([mongo.stop(), mongoose.connection.close()]);
});
