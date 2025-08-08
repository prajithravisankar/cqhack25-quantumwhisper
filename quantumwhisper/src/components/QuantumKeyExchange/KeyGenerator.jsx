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
  const color = b === BASES.Z ? 'modern-badge-secondary' : 'modern-badge-primary';
  return <span className={clsx('modern-badge', color)}>{b}</span>;
}

function BitBadge({ bit }) {
  const color = bit ? 'modern-badge-success' : 'modern-badge-info';
  return <span className={clsx('modern-badge', color)}>{bit}</span>;
}

function QubitBadge({ symbol }) {
  return <span className="modern-badge modern-badge-primary">{symbol}</span>;
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
    <div className="modern-card p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="modern-heading modern-heading-lg">Quantum Key Generator</h2>
          <p className="modern-text-secondary text-sm mt-1">Alice's Station</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm modern-text-secondary">Length:</label>
            <input
              type="number"
              min={16}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="modern-input w-20 text-center"
              aria-label="Key length"
            />
          </div>
          <ControlButton onClick={handleGenerate} loading={loading.generating} disabled={!canGenerate}>
            Generate Key
          </ControlButton>
          <ControlButton variant="secondary" onClick={handleReset}>
            Reset
          </ControlButton>
        </div>
      </div>

      <StatusIndicator status={qStatus} label="Quantum Protocol" error={qError} />

      {prep && (
        <div className="space-y-6">
          <div className="modern-card p-4">
            <h3 className="modern-heading modern-heading-sm mb-4">BB84 Protocol Preparation</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2 modern-text-secondary">Measurement Bases</h4>
                <div className="flex flex-wrap gap-2">
                  {prep.aliceBases.map((b, i) => (
                    <BasisBadge key={`b-${i}`} b={b} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 modern-text-secondary">Random Bits</h4>
                <div className="flex flex-wrap gap-2">
                  {prep.aliceBits.map((bit, i) => (
                    <BitBadge key={`bit-${i}`} bit={bit} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 modern-text-secondary">Quantum States</h4>
              <div className="flex flex-wrap gap-2">
                {qubits.map((q, i) => (
                  <QubitBadge key={`q-${i}`} symbol={q} />
                ))}
              </div>
            </div>
          </div>

          <div className="modern-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="modern-heading modern-heading-sm">Generated Quantum Key</h3>
                <p className="modern-text-secondary text-sm">
                  Length: {session?.keyLength ?? 0} bits (post-reconciliation)
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs modern-text-secondary mb-1">Key Preview</div>
                <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                  {keyStringGenerated ? `${keyStringGenerated.slice(0, 12)}...` : 'No key generated'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <ControlButton 
            onClick={handleTransmit} 
            disabled={!canTransmit}
            loading={txInProgress}
          >
            Transmit via Audio
          </ControlButton>
          <ControlButton variant="secondary" onClick={handleTestAudio}>
            Test Audio
          </ControlButton>
          <ControlButton variant="outline" onClick={handleCopyPayload} disabled={!generatedKeyBits}>
            Copy Quantum Key
          </ControlButton>
          {txDone && (
            <span className="text-sm text-green-600 font-medium">✓ Transmission completed</span>
          )}
        </div>
        
        <StatusIndicator 
          status={aStatus} 
          label="Audio Transmission" 
          progress={progress} 
          error={aError} 
        />
        
        {(txInProgress || aStatus === 'playing' || aStatus === 'started') && audioData && (
          <div className="modern-card p-4">
            <h4 className="modern-heading modern-heading-sm mb-3">Audio Transmission</h4>
            <AudioVisualizer 
              isActive={txInProgress} 
              audioData={audioData} 
              type="waveform" 
              height={60} 
              color="#2563eb" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyGenerator;