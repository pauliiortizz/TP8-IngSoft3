// Mock axios (ESM) so jest doesn't try to parse the real module
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Ensure the service is mocked before importing modules that import it
jest.mock('../services/userService');

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserList from './UserList';
import userService from '../services/userService';

describe('UserList form validation and rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('blocks submission with duplicate name and shows error', async () => {
    userService.getAllUsers.mockResolvedValue([{ id:1, name: 'Alice', email: 'a@a.com' }]);
    render(<UserList />);
    await waitFor(() => expect(userService.getAllUsers).toHaveBeenCalled());

    const nameInput = screen.getByPlaceholderText('Nombre');
    const emailInput = screen.getByPlaceholderText('Email');
    const button = screen.getByRole('button', { name: /Agregar/i });

    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    fireEvent.change(emailInput, { target: { value: 'alice2@test.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/ya existe/i);
    });
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  test('blocks submission with bad word and shows error', async () => {
    userService.getAllUsers.mockResolvedValue([]);
    render(<UserList />);
    await waitFor(() => expect(userService.getAllUsers).toHaveBeenCalled());

    const nameInput = screen.getByPlaceholderText('Nombre');
    const emailInput = screen.getByPlaceholderText('Email');
    const button = screen.getByRole('button', { name: /Agregar/i });

    fireEvent.change(nameInput, { target: { value: 'offensive' } });
    fireEvent.change(emailInput, { target: { value: 'o@o.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/inapropiad|inappropriate|offensive/i);
    });
    expect(userService.createUser).not.toHaveBeenCalled();
  });

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
});

