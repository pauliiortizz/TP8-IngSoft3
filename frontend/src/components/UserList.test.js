import { render, screen } from '@testing-library/react';
import UserList from './UserList';

jest.mock('../services/userService', () => ({
  getAllUsers: jest.fn()
}));

import userService from '../services/userService';


test('muestra usuarios de la API', async () => {
  userService.getAllUsers.mockResolvedValue([
    { id: 1, name: 'Pauli', email: 'pauli@test.com' }
  ]);

  render(<UserList />);

  const user = await screen.findByText(/Pauli/);
  expect(user).toBeInTheDocument();
});

test('muestra mensaje cuando no hay usuarios', async () => {
  userService.getAllUsers.mockResolvedValue([]);

  render(<UserList />);

  const mensaje = await screen.findByText(/No hay usuarios/i);
  expect(mensaje).toBeInTheDocument();
});

