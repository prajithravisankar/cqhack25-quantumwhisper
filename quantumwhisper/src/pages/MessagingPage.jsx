import React from 'react';
import { Link } from 'react-router-dom';
import MessageSender from '@/components/MessageTransmission/MessageSender';
import MessageReceiver from '@/components/MessageTransmission/MessageReceiver';

const MessagingPage = () => {
  return (
    <div className="quantum-bg min-h-screen">
      <div className="modern-container py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-block mb-8 quantum-text-muted hover:text-white transition-colors">
            ← Back to Grimoire
          </Link>
          <h1 className="quantum-heading-xl mb-6">
            � Encrypted Messaging �
          </h1>
          <p className="quantum-text text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Send your secure messages through quantum-encrypted channels. 
            Only those who possess the matching quantum key can decipher your confidential messages.
          </p>
          <div className="quantum-card-orange p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-orange-500">⚡</div>
              <h3 className="quantum-heading-sm">Secure Communication Process</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-sm quantum-text-muted">
              <div>
                <strong className="text-orange-400">Sender's Process:</strong>
                <ul className="mt-2 space-y-2 list-disc list-inside">
                  <li>Compose your secret message</li>
                  <li>Encrypt with quantum key</li>
                  <li>Copy the encrypted ciphertext</li>
                  <li>Share through any communication channel</li>
                </ul>
              </div>
              <div>
                <strong className="text-orange-400">Receiver's Process:</strong>
                <ul className="mt-2 space-y-2 list-disc list-inside">
                  <li>Paste the encrypted message</li>
                  <li>Use quantum key for decryption</li>
                  <li>Read the revealed message</li>
                  <li>Keep the secrets secure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-12">
          <Link 
            to="/key-exchange" 
            className="quantum-button-outline"
          >
            ← � Return to Key Exchange
          </Link>
        </div>

        {/* Warning */}
        <div className="quantum-card-orange p-6 mb-12 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-orange-500">⚠️</div>
            <h3 className="quantum-heading-sm">Security Prerequisites</h3>
          </div>
          <p className="quantum-text text-sm leading-relaxed">
            Both communicators must possess matching quantum keys from the Key Exchange process. 
            Without the matching keys, messages will remain forever encrypted and unreadable.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-2 mb-16">
          <div className="quantum-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">�</div>
              <h2 className="quantum-heading-lg">Sender's Section</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-8 leading-relaxed">
              Encrypt your messages with the power of quantum keys. Your words become unreadable ciphers.
            </p>
            <MessageSender />
          </div>

          <div className="quantum-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">�</div>
              <h2 className="quantum-heading-lg">Receiver's Section</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-8 leading-relaxed">
              Decrypt the encrypted ciphers with your quantum key. Reveal the hidden messages within.
            </p>
            <MessageReceiver />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-16 text-center">
          <div className="quantum-card p-8 max-w-3xl mx-auto">
            <h3 className="quantum-heading-md mb-6">🛡️ Quantum Security Features</h3>
            <div className="grid md:grid-cols-2 gap-8 text-sm quantum-text">
              <div>
                <h4 className="text-orange-400 font-semibold mb-4">Security Features Active:</h4>
                <ul className="space-y-2 text-left">
                  <li>✨ AES-256 encryption with quantum keys</li>
                  <li>🔐 Unique initialization vectors</li>
                  <li>🔒 Authentication tags for integrity</li>
                </ul>
              </div>
              <div>
                <h4 className="text-orange-400 font-semibold mb-4">Threat Protection:</h4>
                <ul className="space-y-2 text-left">
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
