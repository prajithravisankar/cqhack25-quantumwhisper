import React, { useMemo, useState, useContext } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import useAudioProcessor from '@/hooks/useAudioProcessor';
import { BASES, encodeQuantumStates } from '@/utils/quantumSimulator';

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
    const res = await transmitQuantumKey(generatedKeyBits, { retries: 2 });
    setTxInProgress(false);
    setTxDone(res.ok);
  };

  const handleReset = () => {
    clearKeys();
    resetAudio();
    setTxInProgress(false);
    setTxDone(false);
  };

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
          {txDone && <span className="text-xs text-emerald-700">Transmission completed</span>}
        </div>
        <StatusIndicator status={aStatus} label="Audio" progress={progress} error={aError} />
      </div>
    </div>
  );
};

export default KeyGenerator;