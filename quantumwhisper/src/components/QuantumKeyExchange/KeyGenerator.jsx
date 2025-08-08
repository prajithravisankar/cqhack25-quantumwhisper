import React, { useMemo, useState, useContext } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import useAudioProcessor from '@/hooks/useAudioProcessor';
import AudioVisualizer from '@/components/AudioCommunication/AudioVisualizer';
import { BASES, encodeQuantumStates } from '@/utils/quantumSimulator';
import { playTestTone, playQuantumKeyAudio, generateAudioPayload } from '@/utils/audioFallback';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

function BasisBadge({ b }) {
  const color = b === BASES.Z ? 'bg-gray-800 text-white' : 'bg-pink-600 text-white';
  return <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-semibold', color)}>{b}</span>;
}

function BitBadge({ bit }) {
  const color = bit ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white';
  return <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-semibold', color)}>{bit}</span>;
}

function QubitBadge({ symbol }) {
  return <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">{symbol}</span>;
}

const KeyGenerator = () => {
  const {
    session,
    status: qStatus,
    loading,
    error: qError,
    generateQuantumKey,
    generatedKeyBits,
    keyStringGenerated,
    clearKeys,
  } = useContext(QuantumContext);

  const { status: aStatus, progress, error: aError, transmitQuantumKey, reset: resetAudio } = useAudioProcessor();

  const [length, setLength] = useState(32);
  const [txInProgress, setTxInProgress] = useState(false);
  const [txDone, setTxDone] = useState(false);

  const canGenerate = !loading.generating && (qStatus === 'idle' || qStatus === 'generated' || qStatus === 'error');
  const canTransmit = !!generatedKeyBits && !txInProgress;

  const prep = session;
  const qubits = useMemo(() => {
    if (!prep) return [];
    try {
      return encodeQuantumStates(prep.aliceBits, prep.aliceBases);
    } catch {
      return [];
    }
  }, [prep]);

  const handleGenerate = async () => {
    setTxDone(false);
    resetAudio();
    await generateQuantumKey(length);
  };

  const handleTransmit = async () => {
    if (!generatedKeyBits) return;
    setTxInProgress(true);
    setTxDone(false);
    
    try {
      // Try GGWave first
      console.log('Attempting GGWave transmission...');
      const res = await transmitQuantumKey(generatedKeyBits, { retries: 1 });
      if (res.ok) {
        console.log('GGWave transmission successful');
        setTxDone(true);
        setTxInProgress(false);
        return;
      } else {
        console.log('GGWave transmission failed:', res.error?.message);
      }
    } catch (error) {
      console.log('GGWave transmission error:', error.message);
    }
    
    // Fallback to simple audio representation
    try {
      console.log('Using audio fallback...');
      await playQuantumKeyAudio(generatedKeyBits.slice(0, 8)); // Play first 8 bits as tones
      console.log('Audio fallback completed');
      setTxDone(true);
    } catch (audioError) {
      console.log('Audio fallback failed:', audioError.message);
      
      // Last resort: copy to clipboard
      try {
        console.log('Using clipboard fallback...');
        const payload = generateAudioPayload(generatedKeyBits);
        await navigator.clipboard.writeText(payload);
        console.log('Key payload copied to clipboard as fallback');
        alert('Audio transmission failed. Key payload has been copied to clipboard. Paste it in the receiver.');
        setTxDone(true);
      } catch (clipError) {
        console.error('All fallbacks failed:', clipError);
        alert('All transmission methods failed. Please check console for details.');
      }
    }
    
    setTxInProgress(false);
  };

  const handleTestAudio = async () => {
    try {
      await playTestTone(440, 1000);
      console.log('Audio test successful');
    } catch (error) {
      console.error('Audio test failed:', error);
    }
  };

  const handleCopyPayload = async () => {
    if (!generatedKeyBits) return;
    try {
      const payload = generateAudioPayload(generatedKeyBits);
      await navigator.clipboard.writeText(payload);
      console.log('Key payload copied to clipboard');
    } catch (error) {
      console.error('Failed to copy payload:', error);
    }
  };

  const handleReset = () => {
    clearKeys();
    resetAudio();
    setTxInProgress(false);
    setTxDone(false);
  };

  // Audio visualization data
  const audioData = progress?.rms ? Array(50).fill(0).map((_, i) => 
    Math.sin(i * 0.3) * (progress.rms || 0) * 2
  ) : null;

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quantum Key Generator (Alice)</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={16}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-24 rounded border px-2 py-1 text-sm"
            aria-label="Key length"
          />
          <ControlButton onClick={handleGenerate} loading={loading.generating} disabled={!canGenerate}>
            Generate Quantum Key
          </ControlButton>
          <ControlButton variant="secondary" onClick={handleReset}>Reset</ControlButton>
        </div>
      </div>

      <StatusIndicator status={qStatus} label="Quantum" error={qError} />

      {prep && (
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-700">Preparation overview</div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="rounded border p-3">
                <div className="mb-1 text-xs text-gray-500">Bases</div>
                <div className="flex flex-wrap gap-1">
                  {prep.aliceBases.map((b, i) => (
                    <BasisBadge key={`b-${i}`} b={b} />
                  ))}
                </div>
              </div>
              <div className="rounded border p-3">
                <div className="mb-1 text-xs text-gray-500">Bits</div>
                <div className="flex flex-wrap gap-1">
                  {prep.aliceBits.map((bit, i) => (
                    <BitBadge key={`bit-${i}`} bit={bit} />
                  ))}
                </div>
              </div>
              <div className="rounded border p-3 md:col-span-2">
                <div className="mb-1 text-xs text-gray-500">Quantum states</div>
                <div className="flex flex-wrap gap-1">
                  {qubits.map((q, i) => (
                    <QubitBadge key={`q-${i}`} symbol={q} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">Key info</div>
                <div className="text-xs text-gray-500">Length (post-reconciliation): {session?.keyLength ?? 0} bits</div>
              </div>
              <div className="text-xs font-mono text-gray-400">{keyStringGenerated ? `Key: ${'*'.repeat(Math.min(8, keyStringGenerated.length))}…` : 'No key yet'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ControlButton onClick={handleTransmit} disabled={!canTransmit} loading={txInProgress}>
            Transmit Key via Audio
          </ControlButton>
          <ControlButton variant="secondary" onClick={handleTestAudio}>
            Test Audio
          </ControlButton>
          <ControlButton variant="secondary" onClick={handleCopyPayload} disabled={!generatedKeyBits}>
            Copy Payload
          </ControlButton>
          {txDone && <span className="text-xs text-emerald-700">Transmission completed</span>}
        </div>
        <StatusIndicator status={aStatus} label="Audio" progress={progress} error={aError} />
        
        {/* Audio Visualization during transmission */}
        {(txInProgress || aStatus === 'playing' || aStatus === 'started') && (
          <div className="rounded border p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Audio Transmission</div>
            <AudioVisualizer 
              isActive={txInProgress} 
              audioData={audioData} 
              type="waveform" 
              height={60} 
              color="#3B82F6" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyGenerator;