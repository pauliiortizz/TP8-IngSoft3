import axios from 'axios';

const userService = {
  getAllUsers: async () => {
    const response = await axios.get('/users');
    return response.data;
  }
};

export default userService;
