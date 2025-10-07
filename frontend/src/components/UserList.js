// src/components/UserList.js
import { useEffect, useState } from 'react';
import userService from '../services/userService';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    await userService.createUser(newUser);
    setNewUser({ name: '', email: '' });
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este usuario?')) return;
    await userService.deleteUser(id);
    loadUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await userService.updateUser(editingUser.id, editingUser);
    setEditingUser(null);
    loadUsers();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI' }}>
      <h1>👥 Gestión de Usuarios</h1>

      {/* Crear */}
      <form onSubmit={handleCreate} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <button type="submit">Agregar</button>
      </form>

      {/* Lista */}
      <ul>
        {users.length === 0 ? (
          <p>No hay usuarios</p>
        ) : (
          users.map((u) => (
            <li key={u.id}>
              {editingUser?.id === u.id ? (
                <form onSubmit={handleUpdate}>
                  <input
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                  />
                  <input
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                  <button type="submit">Guardar</button>
                  <button onClick={() => setEditingUser(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  {u.name} - {u.email}
                  <button onClick={() => handleEdit(u)}>✏️</button>
                  <button onClick={() => handleDelete(u.id)}>🗑️</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
