import userService from './userService';

jest.mock('axios', () => ({
  get: jest.fn()
}));

import axios from 'axios';

test('getAllUsers devuelve usuarios', async () => {
  const mockUsers = [{ id: 1, name: 'Pauli', email: 'pauli@test.com' }];
  axios.get.mockResolvedValue({ data: mockUsers });

  const users = await userService.getAllUsers();
  expect(users).toEqual(mockUsers);
  expect(axios.get).toHaveBeenCalledWith('/users');
});
