import { useCallback, useContext, useMemo } from 'react';
import QuantumContext from '@/context/QuantumContext';

/**
 * Custom hook for managing quantum key generation and validation.
 */
const useQuantumKey = () => {
  const ctx = useContext(QuantumContext);
  if (!ctx) {
    throw new Error('useQuantumKey must be used within a QuantumProvider');
  }

  const {
    generatedKeyBits,
    receivedKeyBits,
    session,
    status,
    loading,
    error,
    keyStringGenerated,
    keyStringReceived,
    isKeyValid,
    areKeysMatching,
    generateQuantumKey,
    receiveQuantumKey,
    clearKeys,
    validateKeyBits,
    compareKeys,
    bitsToString,
  } = ctx;

  const canSendMessages = useMemo(() => status === 'matched' && isKeyValid, [status, isKeyValid]);

  const generate = useCallback((length = 32) => generateQuantumKey(length), [generateQuantumKey]);
  const receive = useCallback((bits) => receiveQuantumKey(bits), [receiveQuantumKey]);

  return {
    // state
    generatedKeyBits,
    receivedKeyBits,
    session,
    status,
    loading,
    error,

    // derived
    keyStringGenerated,
    keyStringReceived,
    isKeyValid,
    areKeysMatching,
    canSendMessages,

    // actions
    generate,
    receive,
    clearKeys,

    // utils
    validateKeyBits,
    compareKeys,
    bitsToString,
  };
};

export default useQuantumKey;