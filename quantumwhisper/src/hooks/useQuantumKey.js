import { useState } from 'react';
import { simulateQuantumKey } from '@/utils/quantumSimulator';

/**
 * Custom hook for managing quantum key generation.
 * @returns {Array} Quantum key and a function to regenerate it
 */
const useQuantumKey = () => {
  const [quantumKey, setQuantumKey] = useState(simulateQuantumKey());

  const regenerateKey = () => {
    setQuantumKey(simulateQuantumKey());
  };

  return [quantumKey, regenerateKey];
};

export default useQuantumKey;