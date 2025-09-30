import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/users`)
    .then((res) => res.json())
    .then((data) => setUsers(data));
}, []);

  return (
    <div>
      <h1>🚀 Front React funcionando!</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
