import React, { useMemo, useState, useContext } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import { BASES, encodeQuantumStates } from '@/utils/quantumSimulator';
import { encodeWithGGWave, convertQuantumKeyToTransmittable } from '@/utils/ggwaveWrapper';
import { downloadWavFile } from '@/utils/audioFileUtils';

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

  const { status: aStatus, progress, error: aError, reset: resetAudio } = { status: 'idle', progress: null, error: null, reset: () => {} };

  const [length, setLength] = useState(32);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const canGenerate = !loading.generating && (qStatus === 'idle' || qStatus === 'generated' || qStatus === 'error');
  const canDownload = !!generatedKeyBits && !downloadInProgress;

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
    setDownloadDone(false);
    resetAudio();
    await generateQuantumKey(length);
  };

  const handleDownloadSound = async () => {
    if (!generatedKeyBits) return;
    
    setDownloadInProgress(true);
    setDownloadDone(false);
    
    try {
      console.log('🔽 Starting audio file generation for download...');
      
      // Convert quantum key to transmittable format
      const payload = convertQuantumKeyToTransmittable(generatedKeyBits);
      console.log('🔽 Generated payload:', payload);
      
      // Encode with GGWave to get audio samples
      const audioSamples = await encodeWithGGWave(payload);
      console.log('🔽 Generated audio samples:', audioSamples?.length);
      
      if (!audioSamples || audioSamples.length === 0) {
        throw new Error('Failed to generate audio samples');
      }
      
      // Download as WAV file (audioFileUtils can handle Int8Array directly)
      downloadWavFile(audioSamples, 'quantum-key-audio.wav', 48000);
      
      console.log('🔽 Audio file download initiated successfully');
      setDownloadDone(true);
      
    } catch (error) {
      console.error('❌ Failed to generate audio file:', error);
      alert(`Failed to generate audio file: ${error.message}`);
    }
    
    setDownloadInProgress(false);
  };

  const handleCopyPayload = async () => {
    if (!generatedKeyBits) return;
    try {
      const payload = convertQuantumKeyToTransmittable(generatedKeyBits);
      await navigator.clipboard.writeText(payload);
      console.log('Key payload copied to clipboard');
    } catch (error) {
      console.error('Failed to copy payload:', error);
    }
  };

  const handleReset = () => {
    clearKeys();
    resetAudio();
    setDownloadInProgress(false);
    setDownloadDone(false);
  };

  return (
    <div className="modern-card p-6 space-y-6">
      {/* File Workflow Information Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <div className="text-green-600">📤</div>
          <h3 className="text-sm font-semibold text-green-800">File-Based Quantum Key Exchange</h3>
        </div>
        <p className="text-sm text-green-700 mb-2">
          Generate quantum keys and download them as audio files to share with Bob.
        </p>
        <div className="text-xs text-green-600 space-y-1">
          <div>• Click "Generate Key" to create a quantum key using BB84 protocol</div>
          <div>• Click "Download Sound" to save the encoded audio file (.wav)</div>
          <div>• <strong>OR</strong> Click "Copy Quantum Key" to copy the key to clipboard for manual sharing</div>
          <div>• Share the downloaded file with Bob for decoding</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
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
            onClick={handleDownloadSound} 
            disabled={!canDownload}
            loading={downloadInProgress}
          >
            Download Sound
          </ControlButton>
          <ControlButton variant="outline" onClick={handleCopyPayload} disabled={!generatedKeyBits}>
            Copy Quantum Key
          </ControlButton>
          {downloadDone && (
            <span className="text-sm text-green-600 font-medium">✓ Audio file generated</span>
          )}
        </div>
        
        <StatusIndicator 
          status={downloadInProgress ? 'generating' : 'idle'} 
          label="Audio File Generation" 
          error={aError} 
        />
      </div>
    </div>
  );
};

export default KeyGenerator;