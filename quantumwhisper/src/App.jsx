import React from 'react';
import { QuantumProvider } from '@/context/QuantumContext';
import KeyGenerator from '@/components/QuantumKeyExchange/KeyGenerator';
import KeyReceiver from '@/components/QuantumKeyExchange/KeyReceiver';
import MessageSender from '@/components/MessageTransmission/MessageSender';
import MessageReceiver from '@/components/MessageTransmission/MessageReceiver';
import AudioVisualizer from '@/components/AudioCommunication/AudioVisualizer';

function App() {
  return (
    <QuantumProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Clean header */}
        <header className="bg-white border-b border-gray-200">
          <div className="modern-container py-8">
            <div className="text-center">
              <h1 className="modern-heading modern-heading-xl mb-2">QuantumWhisper</h1>
              <p className="modern-text-secondary">
                Secure quantum key exchange and encrypted messaging
              </p>
            </div>
          </div>
        </header>
        
        <main className="modern-container py-8">
          {/* Phase 1: Quantum Key Exchange */}
          <section className="modern-section">
            <div className="text-center mb-8">
              <h2 className="modern-heading modern-heading-lg mb-2">
                Step 1: Quantum Key Exchange
              </h2>
              <p className="modern-text-secondary">
                Generate and exchange quantum keys using the BB84 protocol
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <KeyGenerator />
              <KeyReceiver />
            </div>
          </section>

          {/* Phase 2: Secure Messaging */}
          <section className="modern-section">
            <div className="text-center mb-8">
              <h2 className="modern-heading modern-heading-lg mb-2">
                Step 2: Secure Message Transmission
              </h2>
              <p className="modern-text-secondary">
                Send and receive encrypted messages using quantum keys
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <MessageSender />
              <MessageReceiver />
            </div>
          </section>

          {/* Audio Visualization */}
          <section className="modern-section">
            <div className="text-center mb-8">
              <h2 className="modern-heading modern-heading-lg mb-2">
                Audio Communication Monitor
              </h2>
              <p className="modern-text-secondary">
                Real-time visualization of audio transmission
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="modern-card p-6">
                <h3 className="modern-heading modern-heading-sm mb-4">Waveform</h3>
                <AudioVisualizer type="waveform" height={80} color="#2563eb" />
              </div>
              <div className="modern-card p-6">
                <h3 className="modern-heading modern-heading-sm mb-4">Frequency</h3>
                <AudioVisualizer type="frequency" height={80} color="#10b981" />
              </div>
              <div className="modern-card p-6">
                <h3 className="modern-heading modern-heading-sm mb-4">Audio Level</h3>
                <AudioVisualizer type="level" height={80} color="#f59e0b" />
              </div>
            </div>
          </section>
        </main>

        {/* Clean footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="modern-container py-6">
            <p className="text-center modern-text-muted text-sm">
              Demonstrating BB84 quantum key distribution with audio-transmitted encrypted messaging
            </p>
          </div>
        </footer>
      </div>
    </QuantumProvider>
  );
}

export default App;
