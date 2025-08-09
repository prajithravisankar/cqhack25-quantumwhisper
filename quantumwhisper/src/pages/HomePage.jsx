import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [expandedCard1, setExpandedCard1] = useState(false);
  const [expandedCard2, setExpandedCard2] = useState(false);

  return (
    <div className="quantum-bg min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="modern-container">
          {/* Feature Cards */}
          <div className="flex flex-row justify-center items-center" style={{gap: '80px', flexWrap: 'wrap'}}>
            <div className="quantum-card p-16 text-center quantum-float" style={{flex: '1', maxWidth: '600px', minWidth: '500px', minHeight: '600px'}}>
              <div className="text-8xl mb-12">🔮</div>
              <h2 className="quantum-heading-xl mb-8">Step 1: Quantum Key Exchange</h2>
              
              {/* More Info Label */}
              <div className="text-blue-300/80 text-sm font-medium mb-2 tracking-wide uppercase">
                More Info
              </div>
              
              {/* Toggle Button */}
              <button 
                onClick={() => setExpandedCard1(!expandedCard1)}
                className="mb-8 group relative bg-gradient-to-r from-blue-900/50 to-blue-800/50 hover:from-blue-800/70 hover:to-blue-700/70 border border-blue-400/30 hover:border-blue-300/50 rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 mx-auto"
              >
                <div className="flex items-center justify-center">
                  <span className="mr-3 text-lg font-medium bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                    Discover Protocol Details
                  </span>
                  <div className="relative">
                    <span className={`transform transition-all duration-300 text-xl ${expandedCard1 ? 'rotate-90 text-blue-200' : 'text-blue-400'} group-hover:text-blue-200`}>
                      ⟩
                    </span>
                    <div className={`absolute -inset-1 bg-blue-400/20 rounded-full blur-sm transition-opacity duration-300 ${expandedCard1 ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-300 ${expandedCard1 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="quantum-text mb-12 text-lg leading-relaxed text-center">
                  <div className="mb-6">
                    <p className="text-xl font-semibold mb-3 text-blue-200">
                      Experience authentic quantum cryptography with our BB84 protocol implementation.
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6 text-left">
                    <div className="flex items-start space-x-3 justify-center">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Generate quantum keys by simulating photon polarization states</span>
                    </div>
                    <div className="flex items-start space-x-3 justify-center">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Securely exchange keys through downloadable audio files</span>
                    </div>
                    <div className="flex items-start space-x-3 justify-center">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Establish shared secrets between Alice (sender) and Bob (receiver)</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                    <p className="text-blue-100">
                      This step creates the foundation for <span className="font-semibold text-blue-200">unbreakable encryption</span> using quantum mechanical 
                      principles that automatically detect any eavesdropping attempts.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{marginTop: '60px', marginBottom: '30px'}}>
                <Link to="/key-exchange" className="quantum-button text-lg px-8 py-4">
                  Enter the Quantum Realm
                </Link>
              </div>
            </div>

            <div className="quantum-card p-16 text-center quantum-float" style={{animationDelay: '0.5s', flex: '1', maxWidth: '600px', minWidth: '500px', minHeight: '600px'}}>
              <div className="text-8xl mb-12">💬</div>
              <h2 className="quantum-heading-xl mb-8">Step 2: Encrypted Messaging</h2>
              
              {/* More Info Label */}
              <div className="text-green-300/80 text-sm font-medium mb-2 tracking-wide uppercase">
                More Info
              </div>
              
              {/* Toggle Button */}
              <button 
                onClick={() => setExpandedCard2(!expandedCard2)}
                className="mb-8 group relative bg-gradient-to-r from-green-900/50 to-green-800/50 hover:from-green-800/70 hover:to-green-700/70 border border-green-400/30 hover:border-green-300/50 rounded-lg px-6 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 mx-auto"
              >
                <div className="flex items-center justify-center">
                  <span className="mr-3 text-lg font-medium bg-gradient-to-r from-green-200 to-green-100 bg-clip-text text-transparent">
                    Explore Encryption Process
                  </span>
                  <div className="relative">
                    <span className={`transform transition-all duration-300 text-xl ${expandedCard2 ? 'rotate-90 text-green-200' : 'text-green-400'} group-hover:text-green-200`}>
                      ⟩
                    </span>
                    <div className={`absolute -inset-1 bg-green-400/20 rounded-full blur-sm transition-opacity duration-300 ${expandedCard2 ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-300 ${expandedCard2 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="quantum-text mb-12 text-lg leading-relaxed text-center">
                  <div className="mb-6">
                    <p className="text-xl font-semibold mb-3 text-green-200">
                      Secure your communications with quantum-derived encryption keys from Step 1.
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6 text-left">
                    <div className="flex items-start space-x-3 justify-center">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Uses AES-256 encryption enhanced with quantum key distribution</span>
                    </div>
                    <div className="flex items-start space-x-3 justify-center">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Provides information-theoretic security guarantees</span>
                    </div>
                    <div className="flex items-start space-x-3 justify-center">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Simple workflow: paste message → encrypt → share ciphertext</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-400/30">
                    <p className="text-green-100">
                      Only someone with the <span className="font-semibold text-green-200">matching quantum key</span> can decrypt and read your message, 
                      ensuring complete confidentiality and data integrity.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{marginTop: '60px', marginBottom: '30px'}}>
                <Link to="/messaging" className="quantum-button text-lg px-8 py-4">
                  Encrypt Messages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
