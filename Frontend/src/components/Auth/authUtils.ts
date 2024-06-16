import axios from 'axios';

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('http://localhost:3000/refreshToken', { refreshToken });
    const { token, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', newRefreshToken);
    return token;
  } catch (err) {
    console.error('Error refreshing token:', err);
    return null;
  }
};
