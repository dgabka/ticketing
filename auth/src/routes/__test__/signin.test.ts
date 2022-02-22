import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'password',
  });

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password1',
    })
    .expect(400);
});

it('responds with a cookie', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'password',
  });

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
