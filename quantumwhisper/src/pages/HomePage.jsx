import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="quantum-bg min-h-screen">
      <div className="modern-container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="quantum-heading-xl mb-6 quantum-flicker">
            🎃 QuantumWhisper 🎃
          </h1>
          <p className="text-xl quantum-text mb-8 max-w-3xl mx-auto">
            Experience quantum cryptography with a spooky twist! Exchange quantum keys 
            and send encrypted messages using the mystical powers of the BB84 protocol.
          </p>
          <div className="quantum-glow text-lg quantum-text-muted">
            Perfect your dark arts of quantum communication this Halloween season
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="quantum-card p-8 text-center quantum-float">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="quantum-heading-lg mb-4">Step 1: Quantum Key Exchange</h2>
            <p className="quantum-text mb-6">
              Generate and exchange quantum keys using the BB84 protocol. 
              Alice creates mystical quantum states, Bob measures them, 
              and together they conjure matching cryptographic keys.
            </p>
            <Link to="/key-exchange" className="quantum-button">
              Enter the Quantum Realm
            </Link>
          </div>

          <div className="quantum-card p-8 text-center quantum-float" style={{animationDelay: '0.5s'}}>
            <div className="text-6xl mb-4">💀</div>
            <h2 className="quantum-heading-lg mb-4">Step 2: Encrypted Messaging</h2>
            <p className="quantum-text mb-6">
              Send secret messages encrypted with your quantum keys. 
              Share dark secrets that only the keyholder can decipher. 
              Copy, paste, and haunt your communications with security.
            </p>
            <Link to="/messaging" className="quantum-button">
              Encrypt Dark Messages
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="quantum-card p-6 text-center">
            <div className="text-3xl mb-3">🕸️</div>
            <h3 className="quantum-heading-md mb-2">BB84 Protocol</h3>
            <p className="quantum-text-muted text-sm">
              Authentic quantum key distribution using polarized states
            </p>
          </div>
          
          <div className="quantum-card p-6 text-center">
            <div className="text-3xl mb-3">🦇</div>
            <h3 className="quantum-heading-md mb-2">File-Based Exchange</h3>
            <p className="quantum-text-muted text-sm">
              Download/upload audio files for reliable key transmission
            </p>
          </div>
          
          <div className="quantum-card p-6 text-center">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="quantum-heading-md mb-2">Copy/Paste Security</h3>
            <p className="quantum-text-muted text-sm">
              Simple encrypted message sharing via clipboard
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="quantum-heading-lg mb-4">Ready to Cast Your Quantum Spells?</h2>
          <p className="quantum-text mb-8 max-w-2xl mx-auto">
            Begin your journey into the dark arts of quantum cryptography. 
            Whether you're Alice or Bob, the quantum realm awaits your commands.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/key-exchange" className="quantum-button">
              🎭 Start Key Exchange
            </Link>
            <Link to="/messaging" className="quantum-button-outline">
              👻 Go to Messaging
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
