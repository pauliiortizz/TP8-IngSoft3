const request = require('supertest');
const sequelize = require('../db');
const app = require('../app');
const User = require('../models/user');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Bad words and duplicate-on-update integration', () => {
  test('POST /users rejects names with bad words with 400', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'offensive', email: 'a@b.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/inapropiad|inapropi|inappropriate|palabras/i);
  });

  test('PUT /users/:id rejects updating to a duplicate name (409)', async () => {
    // create two users
    const u1 = await User.create({ name: 'Alice', email: 'alice@test.com' });
    const u2 = await User.create({ name: 'Bob', email: 'bob@test.com' });

    // try to update Bob to name 'Alice'
    const res = await request(app)
      .put(`/users/${u2.id}`)
      .send({ name: 'Alice' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/ya existe|exists/i);
  });
});
