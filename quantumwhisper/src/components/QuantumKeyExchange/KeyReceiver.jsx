import React, { useContext, useMemo, useState } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import useAudioProcessor from '@/hooks/useAudioProcessor';
import { BASES } from '@/utils/quantumSimulator';

function clsx(...arr) { return arr.filter(Boolean).join(' '); }

function BasisBadge({ b }) {
  const color = b === BASES.Z ? 'bg-gray-800 text-white' : 'bg-pink-600 text-white';
  return <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-semibold', color)}>{b}</span>;
}

function BitBadge({ bit }) {
  const color = bit ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white';
  return <span className={clsx('rounded px-1.5 py-0.5 text-[10px] font-semibold', color)}>{bit}</span>;
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
      const unpacked = parseTransmittedQuantumKey(text.trim());
      if (!unpacked) throw new Error('Invalid or no payload in clipboard');
      const bits = unpacked.bits;
      const res = await acceptKey(bits);
      setAccepted(res.ok);
    } catch (e) {
      console.error(e);
    }
  };

  // Visualization pulled from session if available
  const matching = useMemo(() => session?.matchingIndices || [], [session]);
  const aliceBases = session?.aliceBases || [];
  const bobBasesVis = session?.bobBases || [];
  const bobResultsVis = session?.bobResults || [];

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quantum Key Receiver (Bob)</h2>
        <div className="flex items-center gap-2">
          <ControlButton onClick={handleListen} disabled={!canListen} loading={listening}>
            Listen for Quantum Key
          </ControlButton>
          <ControlButton variant="secondary" onClick={handleStop} disabled={!listening}>Stop</ControlButton>
          <ControlButton variant="secondary" onClick={handlePastePayload}>Paste Payload</ControlButton>
        </div>
      </div>

      <StatusIndicator status={aStatus} label="Audio" progress={progress} error={aError} />

      {session && (
        <div className="space-y-3">
          <div className="rounded border p-3">
            <div className="mb-1 text-sm font-medium text-gray-700">Basis reconciliation</div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs text-gray-500">Alice bases</div>
                <div className="flex flex-wrap gap-1">
                  {aliceBases.map((b, i) => (
                    <BasisBadge key={`ab-${i}`} b={b} />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-500">Bob bases</div>
                <div className="flex flex-wrap gap-1">
                  {bobBasesVis.map((b, i) => (
                    <BasisBadge key={`bb-${i}`} b={b} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="mb-1 text-xs text-gray-500">Bob measurement results</div>
              <div className="flex flex-wrap gap-1">
                {bobResultsVis.map((bit, i) => (
                  <BitBadge key={`br-${i}`} bit={bit} />
                ))}
              </div>
            </div>
            <div className="mt-2 text-xs">
              Matching indices: <span className="font-mono">[{matching.join(', ')}]</span>
            </div>
          </div>

          <div className="rounded border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">Received key info</div>
                <div className="text-xs text-gray-500">Length: {session?.keyLength ?? 0} bits</div>
              </div>
              <div className="text-xs font-mono text-gray-400">{keyStringReceived ? `Key: ${'*'.repeat(Math.min(8, keyStringReceived.length))}…` : 'No key yet'}</div>
            </div>
          </div>
        </div>
      )}

      <StatusIndicator status={qStatus} label="Quantum" error={qError} />
    </div>
  );
};

export default KeyReceiver;