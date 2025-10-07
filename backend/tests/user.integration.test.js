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

describe('User API integration tests', () => {
  test('create, get, update, delete user and unique name constraint', async () => {
    // Create user
    const resCreate = await request(app)
      .post('/users')
      .send({ name: 'alice', email: 'alice@test.com' })
      .expect(201);

    expect(resCreate.body).toHaveProperty('id');
    const userId = resCreate.body.id;

    // Duplicate name should fail (unique constraint)
    const resDup = await request(app)
      .post('/users')
      .send({ name: 'alice', email: 'alice2@test.com' });

    expect(resDup.status).toBeGreaterThanOrEqual(400);

    // Get users
    const resGet = await request(app).get('/users').expect(200);
    expect(Array.isArray(resGet.body)).toBe(true);
    expect(resGet.body.length).toBe(1);

    // Update user
    const resUpdate = await request(app)
      .put(`/users/${userId}`)
      .send({ name: 'alice-new', email: 'alice_new@test.com' })
      .expect(200);

    expect(resUpdate.body.name).toBe('alice-new');

    // Delete user
    await request(app).delete(`/users/${userId}`).expect(204);

    const resGet2 = await request(app).get('/users').expect(200);
    expect(resGet2.body.length).toBe(0);
  });
});
