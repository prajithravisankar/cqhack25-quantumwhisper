import React, { useContext, useMemo, useState } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import useAudioProcessor from '@/hooks/useAudioProcessor';
import AudioVisualizer from '@/components/AudioCommunication/AudioVisualizer';
import { BASES } from '@/utils/quantumSimulator';
import { parseAudioPayload } from '@/utils/audioFallback';

function clsx(...arr) { return arr.filter(Boolean).join(' '); }

function BasisBadge({ b }) {
  const color = b === BASES.Z ? 'modern-badge-secondary' : 'modern-badge-primary';
  return <span className={clsx('modern-badge', color)}>{b}</span>;
}

function BitBadge({ bit }) {
  const color = bit ? 'modern-badge-success' : 'modern-badge-info';
  return <span className={clsx('modern-badge', color)}>{bit}</span>;
}

const KeyReceiver = () => {
  const {
    session,
    status: qStatus,
    loading,
    error: qError,
    receivedKeyBits,
    keyStringReceived,
    generateQuantumKey, // optional local sim to show Bob choices
    receiveQuantumKey: acceptKey,
  } = useContext(QuantumContext);

  const { status: aStatus, progress, error: aError, receiveQuantumKey: startListening, stopReception, parseTransmittedQuantumKey } = useAudioProcessor();

  const [listening, setListening] = useState(false);
  const [bobBases, setBobBases] = useState([]);
  const [bobResults, setBobResults] = useState([]);
  const [reconIdx, setReconIdx] = useState([]);
  const [accepted, setAccepted] = useState(false);

  const canListen = !listening && aStatus !== 'listening';

  const handleListen = async () => {
    setAccepted(false);
    setListening(true);
    const handleRes = await startListening({ timeoutMs: 20000 });
    if (!handleRes.ok) {
      setListening(false);
      return;
    }
    // For demo, we can't easily get live decoded bits from handle. We'll simulate reception via manual paste
  };

  const handleStop = () => {
    stopReception();
    setListening(false);
  };

  const handlePastePayload = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log('Pasted text:', text);
      
      // Try multiple payload formats
      let bits = null;
      
      // Try GGWave format first
      const unpacked = parseTransmittedQuantumKey(text.trim());
      if (unpacked && unpacked.bits) {
        bits = unpacked.bits;
        console.log('Parsed as GGWave payload:', bits.length, 'bits');
      } else {
        // Try fallback format
        bits = parseAudioPayload(text.trim());
        if (bits) {
          console.log('Parsed as fallback payload:', bits.length, 'bits');
        }
      }
      
      if (!bits || !Array.isArray(bits) || bits.length < 16) {
        throw new Error('Invalid payload format or too short');
      }
      
      const res = await acceptKey(bits);
      setAccepted(res.ok);
      console.log('Key acceptance result:', res);
    } catch (e) {
      console.error('Failed to process pasted payload:', e);
      // Show user-friendly error
      alert(`Failed to process pasted data: ${e.message}\n\nPlease ensure you've copied the correct payload from the generator.`);
    }
  };

  // Visualization pulled from session if available
  const matching = useMemo(() => session?.matchingIndices || [], [session]);
  const aliceBases = session?.aliceBases || [];
  const bobBasesVis = session?.bobBases || [];
  const bobResultsVis = session?.bobResults || [];

  // Audio visualization data
  const audioData = progress?.rms ? Array(50).fill(0).map((_, i) => 
    Math.sin(i * 0.5) * (progress.rms || 0) * 3
  ) : null;

  return (
    <div className="modern-card p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="modern-heading modern-heading-lg">Quantum Key Receiver</h2>
          <p className="modern-text-secondary text-sm mt-1">Bob's Station</p>
        </div>
        <div className="flex items-center gap-3">
          <ControlButton onClick={handleListen} disabled={!canListen} loading={listening}>
            Listen for Key
          </ControlButton>
          <ControlButton variant="secondary" onClick={handleStop} disabled={!listening}>
            Stop
          </ControlButton>
          <ControlButton variant="outline" onClick={handlePastePayload}>
            Paste Payload
          </ControlButton>
        </div>
      </div>

      <StatusIndicator status={aStatus} label="Audio Reception" progress={progress} error={aError} />

      {(listening || aStatus === 'listening') && (
        <div className="modern-card p-4">
          <h3 className="modern-heading modern-heading-sm mb-3">Audio Reception Active</h3>
          <AudioVisualizer 
            isActive={listening} 
            audioData={audioData} 
            type="level" 
            height={60} 
            color="#10b981" 
          />
        </div>
      )}

      {session && (
        <div className="space-y-6">
          <div className="modern-card p-4">
            <h3 className="modern-heading modern-heading-sm mb-4">Basis Reconciliation</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2 modern-text-secondary">Alice's Bases</h4>
                <div className="flex flex-wrap gap-2">
                  {aliceBases.map((b, i) => (
                    <BasisBadge key={`ab-${i}`} b={b} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 modern-text-secondary">Bob's Bases</h4>
                <div className="flex flex-wrap gap-2">
                  {bobBasesVis.map((b, i) => (
                    <BasisBadge key={`bb-${i}`} b={b} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 modern-text-secondary">Bob's Measurements</h4>
              <div className="flex flex-wrap gap-2">
                {bobResultsVis.map((bit, i) => (
                  <BitBadge key={`br-${i}`} bit={bit} />
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">
                <span className="modern-text-secondary">Matching indices: </span>
                <span className="font-mono text-blue-600">[{matching.join(', ')}]</span>
              </div>
            </div>
          </div>

          <div className="modern-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="modern-heading modern-heading-sm">Received Quantum Key</h3>
                <p className="modern-text-secondary text-sm">
                  Length: {session?.keyLength ?? 0} bits
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs modern-text-secondary mb-1">Key Preview</div>
                <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                  {keyStringReceived ? `${keyStringReceived.slice(0, 12)}...` : 'No key received'}
                </div>
              </div>
            </div>
            
            {accepted && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                ✅ Quantum key successfully received and validated!
              </div>
            )}
          </div>
        </div>
      )}

      <StatusIndicator status={qStatus} label="Quantum Protocol" error={qError} />
    </div>
  );
};

export default KeyReceiver;