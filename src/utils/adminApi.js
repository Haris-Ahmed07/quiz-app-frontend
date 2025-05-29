import axios from 'axios';

// Create a separate axios instance for admin API calls
const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminLogin = async (email, password) => {
  try {
    // Check if it's the admin user
    if (email === 'unsa@gmail.com' && password === 'unsaunsa') {
      // Store the admin token in localStorage
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('isAdmin', 'true');
      
      return {
        success: true,
        user: {
          _id: 'admin',
          name: 'Admin',
          email: 'unsa@gmail.com',
          isAdmin: true
        },
        token: 'admin-token'
      };
    }
    throw new Error('Invalid admin credentials');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await adminApi.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await adminApi.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const response = await adminApi.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete quiz');
  }
};
