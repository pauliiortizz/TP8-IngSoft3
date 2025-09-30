const request = require('supertest');
const app = require('../app');
const sequelize = require('../db');
const User = require('../models/user');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // DB limpia para los tests
});

afterAll(async () => {
  await sequelize.close();
});

describe('User API', () => {
  it('GET /ping debe responder pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/pong/);
  });

  it('GET /users debe devolver lista (aunque vacía)', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /users debe crear un usuario válido', async () => {
    const nuevo = { name: 'Pauli', email: 'pauli@test.com' };
    const res = await request(app).post('/users').send(nuevo);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Pauli');
    expect(res.body.email).toBe('pauli@test.com');
    expect(res.body.id).toBeDefined();
  });

  it('PUT /users/:id debe actualizar un usuario existente', async () => {
    // Arrange: primero crear usuario
    const user = await User.create({ name: 'Feli', email: 'feli@test.com' });

    // Act: actualizar usuario
    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({ name: 'Feli Editado', email: 'feli.edit@test.com' });

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Feli Editado');
    expect(res.body.email).toBe('feli.edit@test.com');
  });

  it('DELETE /users/:id debe eliminar un usuario existente', async () => {
    // Arrange: crear usuario
    const user = await User.create({ name: 'TestDelete', email: 'delete@test.com' });

    // Act: borrar usuario
    const res = await request(app).delete(`/users/${user.id}`);

    // Assert
    expect(res.statusCode).toBe(204);

    // Confirmar que ya no existe
    const check = await User.findByPk(user.id);
    expect(check).toBeNull();
  });

    it('POST /users debe fallar si falta email', async () => {
    const res = await request(app).post('/users').send({ name: 'SinEmail' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('PUT /users/:id debe devolver 404 si el usuario no existe', async () => {
    const res = await request(app)
      .put('/users/9999')
      .send({ name: 'NoExiste', email: 'no@existe.com' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/i);
  });

  it('DELETE /users/:id debe devolver 404 si el usuario no existe', async () => {
    const res = await request(app).delete('/users/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/i);
  });

});