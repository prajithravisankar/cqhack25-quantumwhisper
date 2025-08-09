import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MessageSender from '@/components/MessageTransmission/MessageSender';
import MessageReceiver from '@/components/MessageTransmission/MessageReceiver';

const MessagingPage = () => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  return (
    <div className="quantum-bg min-h-screen">
      <div className="modern-container py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <Link to="/" className="inline-block mb-8 quantum-text-muted hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="quantum-heading-xl mb-8">
            Encrypted Messaging
          </h1>
          <p className="quantum-text text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
            Send your secure messages through quantum-encrypted channels. 
            Only those who possess the matching quantum key can decipher your confidential messages.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-16">
          <Link 
            to="/key-exchange" 
            className="quantum-button-outline"
          >
            ← Return to Key Exchange
          </Link>
        </div>

        {/* Warning */}
        <div className="quantum-card-orange p-8 mb-16 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">!</div>
            <h3 className="quantum-heading-sm">Security Prerequisites</h3>
          </div>
          <p className="quantum-text leading-relaxed">
            Both communicators must possess matching quantum keys from the Key Exchange process. 
            Without the matching keys, messages will remain forever encrypted and unreadable.
          </p>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="flex flex-wrap justify-center gap-16 my-24 max-w-[1800px] mx-auto px-8">
          {/* Sender Section */}
          <div className="quantum-card flex-1 p-16" style={{minWidth: '600px'}}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
              <h2 className="quantum-heading-lg">Message Sender</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-8 leading-relaxed text-center">
              Encrypt your messages with the power of quantum keys. Your words become unreadable ciphers.
            </p>
            <MessageSender />
          </div>

          {/* Receiver Section */}
          <div className="quantum-card flex-1 p-16" style={{minWidth: '600px'}}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
              <h2 className="quantum-heading-lg">Message Receiver</h2>
            </div>
            <p className="quantum-text-muted text-sm mb-8 leading-relaxed text-center">
              Decrypt the encrypted ciphers with your quantum key. Reveal the hidden messages within.
            </p>
            <MessageReceiver />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-20 text-center">
          <div className="quantum-card p-10 max-w-4xl mx-auto">
            <h3 className="quantum-heading-md mb-8">Quantum Security Features</h3>
            
            <button 
              onClick={() => setShowExtraInfo(!showExtraInfo)}
              className="quantum-button-outline mb-8"
            >
              {showExtraInfo ? 'Hide Extra Information' : 'Show Extra Information'}
            </button>

            {showExtraInfo && (
              <div className="grid md:grid-cols-2 gap-12 text-sm quantum-text">
                <div>
                  <h4 className="text-orange-400 font-semibold mb-6">Security Features Active:</h4>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      AES-256 encryption with quantum keys
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Unique initialization vectors
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-orange-400 font-semibold mb-6">Threat Protection:</h4>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Tamper-proof key distribution
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
