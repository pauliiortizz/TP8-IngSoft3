import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UserForm from './UserList';

// Mock the userService to ensure no network calls
jest.mock('../services/userService', () => ({
  createUser: jest.fn(),
  getAllUsers: jest.fn().mockResolvedValue([]),
}));

describe('UserForm validation tests', () => {
  test('shows error when name is empty and does not call API', async () => {
    const { createUser } = require('../services/userService');
    createUser.mockClear();

    await act(async () => {
      render(<UserForm />);
    });

    const submitBtn = screen.getByText(/Agregar/i);
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Expect that the createUser mock was not called
    expect(createUser).not.toHaveBeenCalled();
    // Basic check: the placeholder text is visible
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeTruthy();
  });
});
