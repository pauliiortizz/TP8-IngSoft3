const express = require('express');
const app = express();
const User = require('./models/user');

app.use(express.json());

// ------------------
// ENDPOINTS
// ------------------

const cors = require('cors');
app.use(cors());


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

app.post('/users', async (req, res) => {
  try {
    // Validación: evitar crear dos usuarios con el mismo nombre
    if (!req.body || !req.body.name) {
      return res.status(400).json({ error: 'El campo name es requerido' });
    }

    const existing = await User.findOne({ where: { name: req.body.name } });
    if (existing) {
      return res.status(409).json({ error: 'El nombre de usuario ya existe' });
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error('❌ Error al crear usuario:', err.message);
    if (err.errors) {
      console.error('Detalles:', err.errors.map(e => e.message));
    }
    // Manejar errores de constraint de unicidad por si la BD no tiene índice
    if (err.name === 'SequelizeUniqueConstraintError' || (err.errors && err.errors.some(e => e.message && e.message.toLowerCase().includes('unique')))) {
      return res.status(409).json({ error: 'El nombre de usuario ya existe' });
    }

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
