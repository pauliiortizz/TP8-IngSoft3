import UserList from "./components/UserList";
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <div className="title">👥 Gestión de Usuarios</div>
        </div>
        <UserList />
      </div>
    </div>
  );
}

export default App;
