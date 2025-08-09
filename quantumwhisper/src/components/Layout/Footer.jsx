import React from 'react';

const Footer = () => {
  return (
    <footer className="quantum-card mx-4 mb-4 p-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🕸️</span>
          <span className="quantum-heading-md">Quantum Cryptography Grimoire</span>
          <span className="text-2xl">🕸️</span>
        </div>
        
        <p className="quantum-text text-sm mb-4">
          Demonstrating BB84 quantum key distribution with Halloween-themed encrypted messaging
        </p>
        
        <div className="flex items-center justify-center gap-6 text-xs quantum-text-muted">
          <div className="flex items-center gap-1">
            <span>🔬</span>
            <span>Quantum Physics</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔐</span>
            <span>Cryptography</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎃</span>
            <span>Halloween 2025</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700 quantum-text-muted text-xs">
          "Any sufficiently advanced cryptography is indistinguishable from magic" 🧙‍♂️
        </div>
      </div>
    </footer>
  );
};

export default Footer;
