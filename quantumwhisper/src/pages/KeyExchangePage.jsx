import React from 'react';
import { Link } from 'react-router-dom';
import KeyGenerator from '@/components/QuantumKeyExchange/KeyGenerator';
import KeyReceiver from '@/components/QuantumKeyExchange/KeyReceiver';

const KeyExchangePage = () => {
  return (
    <div className="quantum-bg min-h-screen">
      <div className="modern-container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-6 quantum-text-muted hover:text-white transition-colors">
            ← Back to Grimoire
          </Link>
          <h1 className="quantum-heading-xl mb-4">
            🔮 Quantum Key Exchange 🔮
          </h1>
          <p className="quantum-text text-lg mb-6 max-w-3xl mx-auto">
            Channel the mystical forces of quantum mechanics to create unbreakable cryptographic bonds. 
            Use the ancient BB84 ritual to establish your quantum connection.
          </p>
          <div className="quantum-card-orange p-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-orange-500">🎯</div>
              <h3 className="quantum-heading-sm">How the Dark Ritual Works</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm quantum-text-muted">
              <div>
                <strong className="text-orange-400">Alice (Key Generator):</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Generate quantum key using BB84 protocol</li>
                  <li>Download enchanted audio file (.wav)</li>
                  <li>Share the mystical file with Bob</li>
                </ul>
              </div>
              <div>
                <strong className="text-orange-400">Bob (Key Receiver):</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Upload Alice's audio file</li>
                  <li>Let quantum magic decode the key</li>
                  <li>Use manual input if spirits need assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Link 
            to="/messaging" 
            className="quantum-button-outline"
          >
            👻 Continue to Encrypted Messaging →
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="quantum-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🎭</div>
              <h2 className="quantum-heading-lg">Alice's Chamber</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-6">
              The generator of quantum mysteries. Create and enchant your cryptographic keys here.
            </p>
            <KeyGenerator />
          </div>

          <div className="quantum-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🕷️</div>
              <h2 className="quantum-heading-lg">Bob's Lair</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-6">
              The receiver of quantum secrets. Decode Alice's mystical transmissions here.
            </p>
            <KeyReceiver />
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-12 text-center">
          <div className="quantum-card p-6 max-w-2xl mx-auto">
            <h3 className="quantum-heading-md mb-3">🕸️ Quantum Protocol Status</h3>
            <p className="quantum-text text-sm">
              Once both Alice and Bob complete the key exchange ritual, 
              proceed to the encrypted messaging chamber to begin your secure communications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyExchangePage;
