
import api from './api';

export const login = async (email, password) => {
  const { ok, error, data } = await api.post('/auth/login', {
    email,
    password
  });

  if (!ok) {
    return { success: false, error: error || 'Login failed' };
  }

  const { user, token } = data;
  api.setToken(token);
  localStorage.setItem('user', JSON.stringify(user));
  return { success: true, user, token, error: null };
};
export const register = async (userData) => {
  const { ok, error, data } = await api.post('/auth/register', userData);

  if (!ok) {
    return { success: false, error: error || 'Registration failed' };
  }

  const { user, token } = data;
  api.setToken(token);
  localStorage.setItem('user', JSON.stringify(user));
  return { success: true, user, token, error: null };
};
export const getUserProfile = async () => {
  const { ok, error, data } = await api.get('/user/profile');

  if (!ok) {
    return { success: false, error: error || 'Failed to get user profile' };
  }

  return { success: true, user: data };
};
export const updateUserProfile = async (profileData) => {
  const { ok, error, data } = await api.put('/user/profile', profileData);

  if (!ok) {
    return { success: false, error: error || 'Failed to update user profile' };
  }
  localStorage.setItem('user', JSON.stringify(data));
  return { success: true, user: data };
};
export const logout = () => {
  try {
    api.removeToken();
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  logout
};
