import React, { useState } from 'react';
import axios from 'axios';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/token', { login, password });
      const { token, refreshToken } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      alert('Login successful!');
    } catch (err) {
      setError('Invalid login or password');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
