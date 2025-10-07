import axios from 'axios';

// Preferimos la configuración runtime expuesta en window.__RUNTIME_CONFIG__
// (se carga desde /config.json en `index.js`). Si no existe, usamos la
// variable de entorno REACT_APP_API_URL y finalmente cadena vacía.
const API_URL = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.API_URL)
  || process.env.REACT_APP_API_URL
  || '';

const userService = {
  getAllUsers: async () => {
    const res = await axios.get(`${API_URL}/users`);
    return res.data;
  },
  createUser: async (user) => {
    const res = await axios.post(`${API_URL}/users`, user);
    return res.data;
  },
  updateUser: async (id, user) => {
    const res = await axios.put(`${API_URL}/users/${id}`, user);
    return res.data;
  },
  deleteUser: async (id) => {
    await axios.delete(`${API_URL}/users/${id}`);
  },
};

export default userService;
