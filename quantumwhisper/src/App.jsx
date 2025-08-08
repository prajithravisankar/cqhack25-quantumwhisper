import React from 'react';
import { QuantumProvider } from '@/context/QuantumContext';
import KeyGenerator from '@/components/QuantumKeyExchange/KeyGenerator';
import KeyReceiver from '@/components/QuantumKeyExchange/KeyReceiver';
import { isWebAudioAPISupported } from '@/utils/audioApiTest';

function App() {
  console.log('Web Audio API Supported:', isWebAudioAPISupported());
  return (
    <QuantumProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <header className="mx-auto mb-6 max-w-5xl">
          <h1 className="text-2xl font-bold">QuantumWhisper</h1>
          <p className="text-sm text-gray-600">BB84-based key exchange over audio</p>
        </header>
        <main className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          <KeyGenerator />
          <KeyReceiver />
        </main>
      </div>
    </QuantumProvider>
  );
}

export default App;
