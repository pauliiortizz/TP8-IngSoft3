// Mock the model before requiring modules that use it
jest.mock('../models/user', () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
  };
});

const User = require('../models/user');
const db = require('../db');
// we'll import app and call handler functions via supertest where suitable
const UserController = require('../app');

describe('User service unit tests (mocked Sequelize)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 201 when creating a new user (happy path)', async () => {
    const req = { body: { name: 'unique-name', email: 'a@a.com' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

  User.findOne.mockResolvedValue(null);
  User.create.mockResolvedValue({ id: 123, name: 'unique-name', email: 'a@a.com' });

    // call the actual route handler from app.js by requiring the module and extracting the POST handler
  const app = require('../app');
    const supertest = require('supertest');
    const request = supertest(app);

    const resp = await request.post('/users').send(req.body);
    expect(resp.status).toBe(201);
    expect(resp.body).toHaveProperty('id');
  });

  test('should return 409 when user already exists', async () => {
  User.findOne.mockResolvedValue({ id: 1, name: 'dup', email: 'dup@example.com' });

  const app = require('../app');
    const supertest = require('supertest');
    const request = supertest(app);

    const resp = await request.post('/users').send({ name: 'dup', email: 'x@x.com' });
    expect(resp.status).toBe(409);
    expect(resp.body).toHaveProperty('error');
  });
});
