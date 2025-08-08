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
      <div className="min-h-screen bg-gray-50 p-4">
        <header className="mx-auto mb-6 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900">QuantumWhisper</h1>
          <p className="text-gray-600">Secure quantum key exchange and encrypted messaging over audio</p>
        </header>
        
        <main className="mx-auto max-w-6xl space-y-6">
          {/* Phase 1: Quantum Key Exchange */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Quantum Key Exchange</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <KeyGenerator />
              <KeyReceiver />
            </div>
          </section>

          {/* Phase 2: Secure Messaging */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Secure Message Transmission</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <MessageSender />
              <MessageReceiver />
            </div>
          </section>

          {/* Audio Visualization */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Audio Communication Monitor</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Waveform</h3>
                <AudioVisualizer type="waveform" height={80} color="#3B82F6" />
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Frequency</h3>
                <AudioVisualizer type="frequency" height={80} color="#10B981" />
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Audio Level</h3>
                <AudioVisualizer type="level" height={80} color="#F59E0B" />
              </div>
            </div>
          </section>
        </main>

        <footer className="mx-auto mt-8 max-w-6xl text-center text-sm text-gray-500">
          <p>Demonstrating BB84 quantum key distribution with audio-transmitted encrypted messaging</p>
        </footer>
      </div>
    </QuantumProvider>
  );
}

export default App;
