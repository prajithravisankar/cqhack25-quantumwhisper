import React from 'react';
import { Link } from 'react-router-dom';
import MessageSender from '@/components/MessageTransmission/MessageSender';
import MessageReceiver from '@/components/MessageTransmission/MessageReceiver';

const MessagingPage = () => {
  return (
    <div className="quantum-bg min-h-screen">
      <div className="modern-container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-6 quantum-text-muted hover:text-white transition-colors">
            ← Back to Grimoire
          </Link>
          <h1 className="quantum-heading-xl mb-4">
            💀 Encrypted Messaging 💀
          </h1>
          <p className="quantum-text text-lg mb-6 max-w-3xl mx-auto">
            Whisper your darkest secrets through quantum-encrypted channels. 
            Only those who possess the matching quantum key can decipher your spectral messages.
          </p>
          <div className="quantum-card-orange p-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-orange-500">⚡</div>
              <h3 className="quantum-heading-sm">Dark Communication Ritual</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm quantum-text-muted">
              <div>
                <strong className="text-orange-400">Sender's Incantation:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Compose your secret message</li>
                  <li>Encrypt with quantum key</li>
                  <li>Copy the cursed ciphertext</li>
                  <li>Share through any mortal channel</li>
                </ul>
              </div>
              <div>
                <strong className="text-orange-400">Receiver's Divination:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Paste the encrypted essence</li>
                  <li>Channel quantum key for decryption</li>
                  <li>Witness the message manifest</li>
                  <li>Guard the revealed secrets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Link 
            to="/key-exchange" 
            className="quantum-button-outline"
          >
            ← 🔮 Return to Key Exchange
          </Link>
        </div>

        {/* Warning */}
        <div className="quantum-card-orange p-4 mb-8 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="text-orange-500">⚠️</div>
            <h3 className="quantum-heading-sm">Mystical Prerequisites</h3>
          </div>
          <p className="quantum-text text-sm">
            Both communicators must possess matching quantum keys from the Key Exchange ritual. 
            Without the sacred keys, messages will remain forever encrypted in the void.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="quantum-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🕯️</div>
              <h2 className="quantum-heading-lg">Sender's Sanctum</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-6">
              Encrypt your messages with the power of quantum keys. Your words become unreadable ciphers.
            </p>
            <MessageSender />
          </div>

          <div className="quantum-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🔬</div>
              <h2 className="quantum-heading-lg">Receiver's Ritual Circle</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-6">
              Decrypt the mystical ciphers with your quantum key. Reveal the hidden messages within.
            </p>
            <MessageReceiver />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center">
          <div className="quantum-card p-6 max-w-3xl mx-auto">
            <h3 className="quantum-heading-md mb-3">🛡️ Quantum Security Enchantments</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm quantum-text">
              <div>
                <h4 className="text-orange-400 font-semibold mb-2">Protection Spells Active:</h4>
                <ul className="space-y-1 text-left">
                  <li>✨ AES-256 encryption with quantum keys</li>
                  <li>🔐 Unique initialization vectors</li>
                  <li>🎭 Authentication tags for integrity</li>
                </ul>
              </div>
              <div>
                <h4 className="text-orange-400 font-semibold mb-2">Dark Arts Prevention:</h4>
                <ul className="space-y-1 text-left">
                  <li>👁️ Eavesdropping detection via quantum physics</li>
                  <li>🚫 Tamper-proof key distribution</li>
                  <li>⚡ Information-theoretic security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
