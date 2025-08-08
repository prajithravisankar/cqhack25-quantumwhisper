import { createContext, useCallback, useMemo, useState } from 'react';
import { runBB84, runBB84WithMinKeyLength, simulateQuantumKey, bitsToString, arraysEqual } from '@/utils/quantumSimulator';

/**
 * Context for managing quantum-related state globally.
 */
const QuantumContext = createContext();

export function QuantumProvider({ children }) {
  const [generatedKeyBits, setGeneratedKeyBits] = useState(null);
  const [receivedKeyBits, setReceivedKeyBits] = useState(null);
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'generating' | 'generated' | 'receiving' | 'received' | 'matched' | 'mismatch' | 'error'
  const [loading, setLoading] = useState({ generating: false, receiving: false });
  const [error, setError] = useState(null);

  const validateKeyBits = useCallback((bits, isReceived = false) => {
    // For received keys (after basis reconciliation), accept shorter keys
    const minLength = isReceived ? 8 : 16;
    return Array.isArray(bits) && bits.length >= minLength && bits.every((b) => b === 0 || b === 1);
  }, []);

  const compareKeys = useCallback((a, b) => {
    return arraysEqual(a ?? [], b ?? []);
  }, []);

  const generateQuantumKey = useCallback(async (length = 32) => {
    setLoading((l) => ({ ...l, generating: true }));
    setError(null);
    setStatus('generating');
    try {
      // Use the improved BB84 function that guarantees minimum key length
      const s = runBB84WithMinKeyLength(16); // Always ensure at least 16 bits
      setSession(s);
      setGeneratedKeyBits(s.aliceKeyBits);
      
      // The new function already handles minimum length, but double-check
      if (!s.valid || s.aliceKeyBits.length < 16) {
        setStatus('error');
        setError('Generated key too short (< 16 bits). Try again.');
        return { ok: false, session: s };
      }
      
      setStatus('generated');
      console.log(`✅ Quantum key generated: ${s.aliceKeyBits.length} bits (${s.attempts} attempts, ${s.finalQubitCount} qubits)`);
      return { ok: true, session: s };
    } catch (e) {
      console.error('❌ Quantum key generation failed:', e);
      setError(e?.message || 'Failed to generate key');
      setStatus('error');
      return { ok: false, error: e };
    } finally {
      setLoading((l) => ({ ...l, generating: false }));
    }
  }, []);

  const receiveQuantumKey = useCallback(
    async (bits) => {
      setLoading((l) => ({ ...l, receiving: true }));
      setError(null);
      setStatus('receiving');
      try {
        if (!validateKeyBits(bits, true)) { // Mark as received key
          throw new Error('Invalid key bits (only 0/1, min length 8 for received keys).');
        }
        setReceivedKeyBits(bits);
        const match = compareKeys(generatedKeyBits ?? [], bits);
        setStatus(match ? 'matched' : 'mismatch');
        return { ok: true, match };
      } catch (e) {
        setError(e?.message || 'Failed to receive key');
        setStatus('error');
        return { ok: false, error: e };
      } finally {
        setLoading((l) => ({ ...l, receiving: false }));
      }
    },
    [compareKeys, generatedKeyBits, validateKeyBits]
  );

  const clearKeys = useCallback(() => {
    setGeneratedKeyBits(null);
    setReceivedKeyBits(null);
    setSession(null);
    setStatus('idle');
    setError(null);
    setLoading({ generating: false, receiving: false });
  }, []);

  const value = useMemo(
    () => ({
      // state
      generatedKeyBits,
      receivedKeyBits,
      session,
      status,
      loading,
      error,
      keyStringGenerated: bitsToString(generatedKeyBits || []),
      keyStringReceived: bitsToString(receivedKeyBits || []),
      isKeyValid: validateKeyBits(generatedKeyBits || []),
      areKeysMatching: compareKeys(generatedKeyBits || [], receivedKeyBits || []),

      // actions
      generateQuantumKey,
      receiveQuantumKey,
      clearKeys,

      // utils
      validateKeyBits,
      compareKeys,
      bitsToString,
    }),
    [
      generatedKeyBits,
      receivedKeyBits,
      session,
      status,
      loading,
      error,
      validateKeyBits,
      compareKeys,
      generateQuantumKey,
      receiveQuantumKey,
      clearKeys,
    ]
  );

  return <QuantumContext.Provider value={value}>{children}</QuantumContext.Provider>;
}

export default QuantumContext;