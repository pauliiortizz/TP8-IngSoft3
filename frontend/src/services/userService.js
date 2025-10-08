import axios from 'axios';

// Read API URL at call time so runtime config (loaded asynchronously from
// /config.json in index.js) is respected even if it arrives after module eval.
function getApiUrl() {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.API_URL) {
    return window.__RUNTIME_CONFIG__.API_URL;
  }
  if (process.env && process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  return '';
}

const userService = {
  getAllUsers: async () => {
    const base = getApiUrl();
    const res = await axios.get(`${base}/users`);
    return res.data;
  },
  createUser: async (user) => {
    const base = getApiUrl();
    const res = await axios.post(`${base}/users`, user);
    return res.data;
  },
  updateUser: async (id, user) => {
    const base = getApiUrl();
    const res = await axios.put(`${base}/users/${id}`, user);
    return res.data;
  },
  deleteUser: async (id) => {
    const base = getApiUrl();
    await axios.delete(`${base}/users/${id}`);
  },
};

export default userService;
