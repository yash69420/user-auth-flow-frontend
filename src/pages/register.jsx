import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;
  

  // Debounce function to limit the number of API calls
  let debounceTimeout;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when the user starts typing

    if (e.target.name === 'username') {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => checkUsernameAvailability(e.target.value), 500);
    }

    if (e.target.name === 'password') {
      checkPasswordStrength(e.target.value);
    }
  };

  const handleBlur = (e) => {
    if (e.target.name === 'username') {
      checkUsernameAvailability(e.target.value);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.post(`${API_URL}/api/check-username`, { username });
      setUsernameAvailable(response.data.available);
      if (!response.data.available) {
        setError('Username is already taken');
      }
    } catch (err) {
      console.error('Error checking username availability:', err);
    }
  };

  const checkPasswordStrength = (password) => {
    const strength = getPasswordStrength(password);
    setPasswordStrength(strength);
  };

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'Weak'; // Password is too short
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[@$!%*?&#]/)) {
      return 'Strong';
    } else if (password.length >= 8) {
      return 'Moderate';
    }
    return 'Weak';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameAvailable) {
      setError('Username is already taken');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength === 'Weak') {
      setError('Password is too weak');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        // Registration successful, handle success (e.g., redirect to login page)
        console.log(response.data.message);
        // Redirect to login page or show a success message
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('Server error. Please try again later.');
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'Strong':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'Weak':
        return 'bg-red-500';
      default:
        return 'bg-white'; // Default color (white) if no input
    }
  };

  const getPasswordStrengthWidth = (strength) => {
    switch (strength) {
      case 'Strong':
        return 'w-full';
      case 'Moderate':
        return 'w-2/3';
      case 'Weak':
        return 'w-1/3';
      default:
        return 'w-0'; // Default width if no input
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur} // Trigger availability check on blur
              required
              className={`w-full px-3 py-2 mt-1 border ${
                !usernameAvailable ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring focus:ring-indigo-200`}
            />
            {!usernameAvailable && (
              <p className="text-sm text-red-500">Username is already taken</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            />
            {!/^(.+)@.{2,}\..{2,}$/.test(formData.email) && formData.email && (
              <p className="text-sm text-red-500">Invalid email address</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            />
            {passwordRequirements && (
              <p className={`text-sm ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                {passwordRequirements}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            />
            {formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
          </div>
          <div className="w-full mt-4">
            <div className="h-2 bg-white border border-gray-300 rounded">
              <div className={`h-full ${getPasswordStrengthColor(passwordStrength)} ${getPasswordStrengthWidth(passwordStrength)} rounded`}></div>
            </div>
            <p className="text-sm mt-2">
              Password Strength: {passwordStrength}
            </p>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700">Login</Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


