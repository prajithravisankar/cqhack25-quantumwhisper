// Simple dev harness for manual audio tests in the browser console
import { runBB84 } from '@/utils/quantumSimulator';
import {
  convertQuantumKeyToTransmittable,
  parseTransmittedQuantumKey,
  transmitQuantumKey,
  receiveQuantumKey,
} from '@/utils/ggwaveWrapper';

export async function demoTransmitOnce() {
  const session = runBB84(32);
  if (!session.valid) {
    console.warn('Session invalid, try again');
    return { ok: false };
  }
  const bits = session.aliceKeyBits;
  const res = await transmitQuantumKey(bits, {
    retries: 1,
    onStatus: (s) => console.log('TX:', s),
  });
  return res;
}

export async function demoReceiveStart() {
  return receiveQuantumKey({
    onStatus: (s) => console.log('RX:', s),
    timeoutMs: 15000,
  });
}

export function demoFormat(bits) {
  const b64 = convertQuantumKeyToTransmittable(bits);
  return parseTransmittedQuantumKey(b64);
}
