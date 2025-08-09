import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="quantum-card mx-8 mt-8 p-8">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🔮</span>
          <h1 className="quantum-heading-xl mb-8 quantum-flicker">QuantumWhisper</h1>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center justify-center" style={{gap: '60px', width: '100%'}}>
          <div style={{margin: '0 20px'}}>
            <Link 
              to="/" 
              className={`px-6 py-3 rounded-lg transition-all quantum-heading-sm ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-black font-semibold' 
                  : 'quantum-text hover:text-white hover:bg-gray-800'
              }`}
            >
              🏠 Home
            </Link>
          </div>
          
          <div style={{margin: '0 20px'}}>
            <Link 
              to="/key-exchange" 
              className={`px-6 py-3 rounded-lg transition-all quantum-heading-sm ${
                isActive('/key-exchange') 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-black font-semibold' 
                  : 'quantum-text hover:text-white hover:bg-gray-800'
              }`}
            >
              🔐 Key Exchange
            </Link>
          </div>
          
          <div style={{margin: '0 20px'}}>
            <Link 
              to="/messaging" 
              className={`px-6 py-3 rounded-lg transition-all quantum-heading-sm ${
                isActive('/messaging') 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-black font-semibold' 
                  : 'quantum-text hover:text-white hover:bg-gray-800'
              }`}
            >
              💬 Messaging
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;