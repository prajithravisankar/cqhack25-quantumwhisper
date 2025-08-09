import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="quantum-card mx-4 mt-4 p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎃</span>
          <span className="quantum-heading-md quantum-glow">QuantumWhisper</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('/') 
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-black font-semibold' 
                : 'quantum-text hover:text-white hover:bg-gray-800'
            }`}
          >
            🏠 Home
          </Link>
          
          <Link 
            to="/key-exchange" 
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('/key-exchange') 
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-black font-semibold' 
                : 'quantum-text hover:text-white hover:bg-gray-800'
            }`}
          >
            🔮 Key Exchange
          </Link>
          
          <Link 
            to="/messaging" 
            className={`px-4 py-2 rounded-lg transition-all ${
              isActive('/messaging') 
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-black font-semibold' 
                : 'quantum-text hover:text-white hover:bg-gray-800'
            }`}
          >
            💀 Messaging
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
