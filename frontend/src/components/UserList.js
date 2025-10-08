import React, { useEffect, useState } from 'react';
import userService from '../services/userService';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await userService.getAllUsers();
        if (!mounted) return;
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading users', err);
        if (mounted) setUsers([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || name.trim() === '') {
      setError('El nombre es requerido');
      return;
    }
    if (!email || email.trim() === '') {
      setError('El email es requerido');
      return;
    }
    try {
      const payload = { name: name.trim(), email: email.trim() };
      const created = await userService.createUser(payload);
      // optimistic add
      setUsers((prev) => [...prev, created]);
      setName('');
      setEmail('');
      setError(null);
    } catch (err) {
      // Improve logging so we can see HTTP status / body from axios
      if (err && err.response) {
        console.error('Error creating user', err.response.status, err.response.data);
        setError(`Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
      } else {
        console.error('Error creating user', err && err.message ? err.message : err);
        setError(err && err.message ? err.message : String(err));
      }
    }
  };

  return (
    <div>
      <h2>Usuarios</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <button type="submit">Agregar</button>
      </form>

      <ul>
        {users.length === 0 ? (
          <li>No hay usuarios</li>
        ) : (
          users.map((u) => (
            <li key={u.id}>{u.name} {u.email ? `- ${u.email}` : ''}</li>
          ))
        )}
      </ul>
      {error && (
        <div style={{ color: 'crimson', marginTop: 12 }} role="alert">{error}</div>
      )}
    </div>
  );
}
