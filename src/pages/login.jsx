import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Access the backend API URL from the environment variables
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // Log the API URL to ensure it's correctly loaded (DO NOT log sensitive data)
  console.log('VITE_API_URL:', VITE_API_URL);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when the user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Encrypt or hash the password here if needed before sending it to the server
    const encryptedData = {
      ...formData,
      // Add your encryption method here (e.g., hashing)
      // password: encryptPassword(formData.password),
    };

    try {
      const response = await axios.post(`${VITE_API_URL}/api/auth/login`, encryptedData);
      if (response.status === 200) {
        // Save the token or handle successful login (e.g., redirect to dashboard)
        console.log('Login successful:', response.data.token);
        setError('');
        // Handle successful login, e.g., redirect to another page or store the token
      }
    } catch (err) {
      // Improved error logging
      console.error('Error response:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded ${
              loading ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring focus:ring-indigo-300`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center">
            <a href="/forgot-password" className="text-indigo-600 hover:underline">Forgot Password?</a>
          </p>
          <p className="text-center">
            Don't have an account? <a href="/register" className="text-indigo-600 hover:underline">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
