import { describe, it, expect } from 'vitest';
import {
  bitsToBytes,
  assertKeyBits,
  deriveAesGcmKeyFromBits,
  encryptTextWithQuantumKey,
  decryptTextWithQuantumKey,
  parseEncryptedPackage,
  validateEncryptedPackage,
} from './encryption';

function sampleBits(n = 32) {
  return Array.from({ length: n }, (_, i) => (i % 2));
}

describe('encryption utils', () => {
  it('bitsToBytes packs bits correctly', () => {
    const bits = [1,0,1,0,1,0,1,0];
    const bytes = bitsToBytes(bits);
    expect(bytes.length).toBe(1);
    expect(bytes[0]).toBe(0b10101010);
  });

  it('assertKeyBits validates', () => {
    expect(() => assertKeyBits([0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1])).not.toThrow();
    expect(() => assertKeyBits([])).toThrow();
    expect(() => assertKeyBits([2])).toThrow();
  });

  it('deriveAesGcmKeyFromBits produces a key and salt', async () => {
    const { key, salt, iterations } = await deriveAesGcmKeyFromBits(sampleBits());
    expect(key).toBeDefined();
    expect(salt).toBeInstanceOf(Uint8Array);
    expect(typeof iterations).toBe('number');
  });

  it('encrypts and decrypts text roundtrip', async () => {
    const bits = sampleBits();
    const enc = await encryptTextWithQuantumKey('hello world', bits);
    expect(enc.ok).toBe(true);
    const pkg = parseEncryptedPackage(enc.b64);
    expect(pkg).not.toBeNull();
    expect(validateEncryptedPackage(pkg)).toBe(true);
    const dec = await decryptTextWithQuantumKey(enc.b64, bits);
    expect(dec.ok).toBe(true);
    expect(dec.plaintext).toBe('hello world');
  });

  it('decryption fails with wrong key', async () => {
    const bits = sampleBits();
    const wrong = sampleBits().map((b) => (b ^ 1));
    const enc = await encryptTextWithQuantumKey('secret', bits);
    const dec = await decryptTextWithQuantumKey(enc.b64, wrong);
    expect(dec.ok).toBe(false);
  });
});
