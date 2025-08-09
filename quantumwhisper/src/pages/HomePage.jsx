import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="quantum-bg min-h-screen">
      <div className="modern-container py-16">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="quantum-heading-xl mb-8 quantum-flicker">
            QuantumWhisper
          </h1>
          <p className="text-xl quantum-text mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience quantum cryptography! Exchange quantum keys 
            and send encrypted messages using the power of the BB84 protocol.
          </p>
          <div className="quantum-glow text-lg quantum-text-muted">
            Master the art of quantum communication
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 mb-24" style={{gap: '50px'}}>
          <div className="quantum-card p-12 text-center quantum-float" style={{marginTop: '30px', marginBottom: '30px'}}>
            <div className="text-6xl mb-8">🔮</div>
            <h2 className="quantum-heading-lg mb-6">Step 1: Quantum Key Exchange</h2>
            <p className="quantum-text mb-8 leading-relaxed">
              Generate and exchange quantum keys using the BB84 protocol. 
              Alice creates mystical quantum states, Bob measures them, 
              and together they conjure matching cryptographic keys.
            </p>
            <div style={{marginTop: '45px', marginBottom: '20px'}}>
              <Link to="/key-exchange" className="quantum-button">
                Enter the Quantum Realm
              </Link>
            </div>
          </div>

          <div className="quantum-card p-12 text-center quantum-float" style={{animationDelay: '0.5s', marginTop: '30px', marginBottom: '30px'}}>
            <div className="text-6xl mb-8">💬</div>
            <h2 className="quantum-heading-lg mb-6">Step 2: Encrypted Messaging</h2>
            <p className="quantum-text mb-8 leading-relaxed">
              Send secure messages encrypted with your quantum keys. 
              Share confidential information that only the keyholder can decipher. 
              Copy, paste, and secure your communications with encryption.
            </p>
            <div style={{marginTop: '45px', marginBottom: '20px'}}>
              <Link to="/messaging" className="quantum-button">
                Encrypt Messages
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="quantum-heading-lg mb-6">Ready to Begin Quantum Communication?</h2>
          <p className="quantum-text mb-12 max-w-2xl mx-auto leading-relaxed">
            Begin your journey into quantum cryptography. 
            Whether you're Alice or Bob, the quantum realm awaits your commands.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/key-exchange" className="quantum-button">
              🔐 Start Key Exchange
            </Link>
            <Link to="/messaging" className="quantum-button-outline">
              💬 Go to Messaging
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
