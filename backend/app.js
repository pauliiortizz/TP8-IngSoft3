const express = require('express');
const app = express();
const User = require('./models/user');

app.use(express.json());

// ------------------
// ENDPOINTS
// ------------------

// Healthcheck
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// GET /users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// POST /users
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /users/:id
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = app;
