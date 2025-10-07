// Forzamos la variable de entorno antes de importar el módulo para que
// `userService` lea la URL correcta al cargarse.
process.env.REACT_APP_API_URL = '';

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
  // En el entorno de test la URL relativa puede resolverse a una absoluta
  // (p. ej. http://localhost:5000/users), por eso comprobamos que termine en '/users'
  expect(axios.get.mock.calls[0][0]).toEqual(expect.stringMatching(/\/users$/));
});
