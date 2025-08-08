import { useState } from 'react'
import viteLogo from '/vite.svg'
import { isWebAudioAPISupported } from '@/utils/audioApiTest';



function App() {
  console.log('Web Audio API Supported:', isWebAudioAPISupported());
  return <h1>QuantumWhisper App</h1>
}

export default App
