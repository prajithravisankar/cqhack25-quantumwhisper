import { useCallback, useMemo, useState } from 'react';
import { encryptTextWithQuantumKey, decryptTextWithQuantumKey, assertKeyBits } from '@/utils/encryption';

/**
 * Custom hook for managing encryption and decryption.
 * @param {number} quantumKeyBits - The quantum key bits for encryption/decryption
 * @returns {Object} Functions for encrypting and decrypting messages
 */
const useEncryption = (quantumKeyBits) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'encrypting' | 'decrypting' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [lastPackage, setLastPackage] = useState(null);
  const [lastPlaintext, setLastPlaintext] = useState(null);

  const isKeyValid = useMemo(() => {
    try { assertKeyBits(quantumKeyBits || []); return true; } catch { return false; }
  }, [quantumKeyBits]);

  const encrypt = useCallback(async (plaintext) => {
    setError(null);
    setStatus('encrypting');
    try {
      if (!isKeyValid) throw new Error('Quantum key invalid or missing');
      const res = await encryptTextWithQuantumKey(plaintext, quantumKeyBits);
      setLastPackage(res.package);
      setStatus('success');
      return res; // { ok, package, b64 }
    } catch (e) {
      setError(e?.message || 'Encryption failed');
      setStatus('error');
      return { ok: false, error: e };
    }
  }, [isKeyValid, quantumKeyBits]);

  const decrypt = useCallback(async (pkgOrB64) => {
    setError(null);
    setStatus('decrypting');
    try {
      if (!isKeyValid) throw new Error('Quantum key invalid or missing');
      const res = await decryptTextWithQuantumKey(pkgOrB64, quantumKeyBits);
      if (res.ok) setLastPlaintext(res.plaintext);
      setStatus(res.ok ? 'success' : 'error');
      return res; // { ok, plaintext } | { ok: false, error }
    } catch (e) {
      setError(e?.message || 'Decryption failed');
      setStatus('error');
      return { ok: false, error: e };
    }
  }, [isKeyValid, quantumKeyBits]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setLastPackage(null);
    setLastPlaintext(null);
  }, []);

  return {
    status,
    error,
    isKeyValid,
    lastPackage,
    lastPlaintext,
    encrypt,
    decrypt,
    reset,
  };
};

export default useEncryption;