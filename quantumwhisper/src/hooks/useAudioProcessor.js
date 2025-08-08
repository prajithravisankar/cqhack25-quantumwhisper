import { useCallback, useEffect, useRef, useState } from 'react';
import {
  convertQuantumKeyToTransmittable,
  transmitQuantumKey as transmit,
  receiveQuantumKey as receive,
  parseTransmittedQuantumKey,
} from '@/utils/ggwaveWrapper';
import { encodeAudio, decodeAudio } from '@/utils/audioProcessor';

/**
 * Custom hook for handling audio encoding and decoding.
 * @returns {Object} Functions for encoding and decoding audio
 */
const useAudioProcessor = () => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const receiverRef = useRef(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(null);
    setError(null);
  }, []);

  const transmitQuantumKey = useCallback(
    async (bitsArray, { retries = 1 } = {}) => {
      setError(null);
      setStatus('preparing');
      const onStatus = ({ status: s, ...extra }) => {
        setStatus(s);
        setProgress(extra || null);
      };

      const res = await transmit(bitsArray, { onStatus, retries });
      if (!res.ok) setError(res.error?.message || 'Transmission failed');
      return res;
    },
    []
  );

  const receiveQuantumKey = useCallback(
    async ({ timeoutMs = 15000 } = {}) => {
      setError(null);
      setStatus('preparing');

      try {
        const handle = await receive({
          timeoutMs,
          onStatus: ({ status: s, ...extra }) => {
            setStatus(s);
            setProgress(extra || null);
          },
        });
        receiverRef.current = handle;
        return { ok: true, handle };
      } catch (e) {
        setError(e?.message || 'Reception failed');
        setStatus('error');
        return { ok: false, error: e };
      }
    },
    []
  );

  const stopReception = useCallback(() => {
    try {
      receiverRef.current?.stop?.();
      receiverRef.current = null;
      setStatus('stopped');
    } catch (e) {
      setError(e?.message || 'Failed to stop reception');
      setStatus('error');
    }
  }, []);

  useEffect(
    () => () => {
      // cleanup on unmount
      try {
        receiverRef.current?.stop?.();
      } catch {}
    },
    []
  );

  const encode = (data) => encodeAudio(data);
  const decode = (audio) => decodeAudio(audio);

  return {
    status,
    progress,
    error,
    reset,
    transmitQuantumKey,
    receiveQuantumKey,
    stopReception,
    convertQuantumKeyToTransmittable,
    parseTransmittedQuantumKey,
    encode,
    decode,
  };
};

export default useAudioProcessor;