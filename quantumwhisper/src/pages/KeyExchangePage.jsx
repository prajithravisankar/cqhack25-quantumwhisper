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
          <p className="quantum-text text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Channel the mystical forces of quantum mechanics to create unbreakable cryptographic bonds. 
            Use the ancient BB84 ritual to establish your quantum connection.
          </p>
          <div className="quantum-card-orange p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-orange-500">🎯</div>
              <h3 className="quantum-heading-sm">How the Dark Ritual Works</h3>
            </div>
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
        <div className="grid gap-12 lg:grid-cols-2 mb-16">
          <div className="quantum-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">🔐</div>
              <h2 className="quantum-heading-lg">Alice's Chamber</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-8 leading-relaxed">
              The generator of quantum mysteries. Create and enchant your cryptographic keys here.
            </p>
            <KeyGenerator />
          </div>

          <div className="quantum-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">�</div>
              <h2 className="quantum-heading-lg">Bob's Lair</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-8 leading-relaxed">
              The receiver of quantum secrets. Decode Alice's mystical transmissions here.
            </p>
            <KeyReceiver />
          </div>
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
