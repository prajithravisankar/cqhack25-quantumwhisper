import React from 'react';

const Footer = () => {
  return (
    <footer className="quantum-card mx-6 mb-6 p-8 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="quantum-heading-md">QuantumWhisper</span>
        </div>
        
        <p className="quantum-text text-sm mb-8 leading-relaxed">
          Demonstrating BB84 quantum key distribution with secure encrypted messaging
        </p>
        
        <div className="flex items-center justify-center gap-8 text-xs quantum-text-muted">
          <div className="flex items-center gap-2">
            <span>🔬</span>
            <span>Quantum Physics</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔐</span>
            <span>Cryptography</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
