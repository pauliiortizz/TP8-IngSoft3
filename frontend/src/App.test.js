// Mockeamos el service para que no intente importar 'axios' (que ahora es ESM)
jest.mock('./services/userService', () => ({
  getAllUsers: jest.fn().mockResolvedValue([{ id: 1, name: 'AppUser', email: 'app@test.com' }])
}));

import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza el título de la app', () => {
  render(<App />);
  // El texto real de App es el del componente UserList; ajustamos la comprobación
  const maybe = screen.queryByText(/Gesti.n de Usuarios/i);
  // Comprobamos que el componente se renderiza (al menos un elemento de la UI)
  expect(maybe).not.toBeNull();
});
