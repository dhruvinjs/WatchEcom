import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const { login } = useAuth(); // User info and authentication functions
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // Default role is 'customer'
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(''); // To capture any error messages
  const [isSignUp, setIsSignUp] = useState(false); // Toggles between Sign In and Sign Up

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (role === 'seller') {
        // Seller-specific Sign Up or Login
        if (isSignUp) {
          response = await axios.post('http://localhost:5000/auth/seller/signup', {
            name,
            email,
            password,
            phone,
          });
          alert('Seller Sign Up successful!');
        } else {
          response = await axios.post('http://localhost:5000/auth/seller/login', {
            email,
            password,
          });
          alert('Seller Sign In successful!');
        }
      } else {
        // Customer-specific Sign Up or Login
        if (isSignUp) {
          response = await axios.post('http://localhost:5000/auth/signup', {
            name,
            email,
            password,
            role,
          });
          alert('Sign Up successful!');
        } else {
          response = await axios.post('http://localhost:5000/auth/login', {
            email,
            password,
          });
          alert('Sign In successful!');
        }
      }

      // If the API responds successfully, sign the user in
      login(response.data.user); // Save the logged-in user's data in context
      localStorage.setItem('userId', response.data.userId);
      onAuthSuccess(role); // Callback to handle redirection based on role
      onClose();
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-400"
            disabled={loading}
          >
            {loading ? 'Submitting...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp((prev) => !prev)}
            className="text-sm text-gray-600"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
