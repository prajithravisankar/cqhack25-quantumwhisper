import React from 'react';
import { Link } from 'react-router-dom';
import KeyGenerator from '@/components/QuantumKeyExchange/KeyGenerator';
import KeyReceiver from '@/components/QuantumKeyExchange/KeyReceiver';

const KeyExchangePage = () => {
  return (
    <div className="quantum-bg min-h-screen">
      <div className="modern-container py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-block mb-8 quantum-text-muted hover:text-white transition-colors">
            ← Back to Grimoire
          </Link>
          <h1 className="quantum-heading-xl mb-6">
            🔮 Quantum Key Exchange 🔮
          </h1>
          <div className="quantum-card-orange p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 text-sm quantum-text-muted">
              <div>
                <strong className="text-orange-400">Alice (Key Generator):</strong>
                <ul className="mt-2 space-y-2 list-disc list-inside">
                  <li>Generate quantum key using BB84 protocol</li>
                  <li>Download enchanted audio file (.wav)</li>
                  <li>Share the mystical file with Bob</li>
                </ul>
              </div>
              <div>
                <strong className="text-orange-400">Bob (Key Receiver):</strong>
                <ul className="mt-2 space-y-2 list-disc list-inside">
                  <li>Upload Alice's audio file</li>
                  <li>Let quantum magic decode the key</li>
                  <li>Use manual input if spirits need assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-12">
          <Link 
            to="/messaging" 
            className="quantum-button-outline"
          >
            � Continue to Encrypted Messaging →
          </Link>
        </div>

        {/* Main Content */}
        <div style={{display: 'flex', flexDirection: 'row', gap: '3rem', marginBottom: '4rem', maxWidth: '95rem', margin: '0 auto'}}>
          <div className="quantum-card" style={{flex: '1', minWidth: '0', padding: '3rem'}}>
            <div className="flex items-center gap-3 mb-8">
              <div className="text-3xl">1️⃣</div>
              <h2 className="quantum-heading-lg">Step 1</h2>
            </div>
            <p className="text-white text-sm mb-10 leading-relaxed">
              Generate quantum cryptographic keys using the BB84 protocol. Create secure key pairs for encrypted communication.
            </p>
            <KeyGenerator />
          </div>

          <div className="quantum-card" style={{flex: '1', minWidth: '0', padding: '3rem'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">2️⃣</div>';
              <h2 className="quantum-heading-lg">Step 2</h2>
            </div>
            <p className="text-white text-sm mb-8 leading-relaxed">
              Receive and process quantum keys from Alice. Import audio files to establish secure communication channels.
            </p>
            <KeyReceiver />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-12">
          <Link 
            to="/messaging" 
            className="quantum-button-outline"
          >
            � Continue to Encrypted Messaging →
          </Link>
        </div>

        {/* Status Footer */}
        <div className="mt-16 text-center">
          <div className="quantum-card p-8 max-w-2xl mx-auto">
            <h3 className="quantum-heading-md mb-4">Quantum Protocol Status</h3>
            <p className="quantum-text text-sm leading-relaxed">
              Once both Alice and Bob complete the key exchange process, 
              proceed to the encrypted messaging section to begin your secure communications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyExchangePage;
