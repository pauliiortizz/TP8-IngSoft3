import { useEffect, useState } from 'react';
import userService from '../services/userService';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getAllUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  if (users.length === 0) return <p>No hay usuarios</p>;

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name} - {u.email}</li>
      ))}
    </ul>
  );
}
