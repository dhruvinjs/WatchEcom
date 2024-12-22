import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import AuthModal from './AuthModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut } from 'lucide-react';

function Header({ component }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Fetch Cart Count
  const fetchCartCount = async () => {
    if (!userId) return;
    try {
      const response = await axios.post('https://watch-ecom-bay.vercel.app/cart/get-cart', { userId });
      setCartCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [location]); // Re-fetch cart count on location change

  // Handle Profile Click
  const handleProfileClick = () => {
    if (!userId) {
      setModalOpen(true);
    } else {
      alert(`Welcome back, ${user?.name || `User ID: ${userId}`}`);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post('https://watch-ecom-bay.vercel.app/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('userId'); // Clear user data from local storage
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle Successful Login
  const handleAuthSuccess = (userRole) => {
    setModalOpen(false);
    if (userRole === 'seller') {
      navigate('/seller'); // Redirect to Seller Dashboard
    } else {
      navigate('/'); // Redirect to Home for non-sellers
    }
  };

  return (
    <>
      <header className="bg-emerald-600 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-3xl font-bold text-gold-500 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Timeless Pieces
          </h1>
          <LogOut onClick={handleLogout} className="text-white cursor-pointer" />
          {!component && (
            <div className="flex-grow mx-6 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Watches"
                  className="w-full p-2 pl-10 rounded-md border border-gray-700 bg-emerald-500 text-white focus:ring-2 focus:ring-gold-300"
                />
                <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Seller Login
          </button>
          <div className="flex space-x-4 items-center">
            <button onClick={handleProfileClick} className="text-white">
              <User className="w-6 h-6 text-gold-400" />
            </button>
            <Heart className="w-6 h-6 text-gold-400" />
            <div className="relative">
              <ShoppingBag
                className="w-6 h-6 text-gold-400 cursor-pointer"
                onClick={() => navigate('/cart')}
              />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </div>
            {/* Conditional Seller Buttons */}
            {user?.role === 'seller' && (
              <>
                <button
                  onClick={() => navigate('/seller/auth')}
                  className="bg-white text-emerald-700 border border-emerald-700 py-2 px-4 rounded hover:bg-emerald-100"
                >
                  Add Product
                </button>
              </>
            )}
            {/* Show Logout for authenticated users */}
            {user && !user.role && (
              <button
                onClick={handleLogout}
                className="bg-gold-500 text-black py-2 px-4 rounded hover:bg-gold-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && (
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onAuthSuccess={handleAuthSuccess} // Callback to handle successful login
        />
      )}
    </>
  );
}

export default Header;
