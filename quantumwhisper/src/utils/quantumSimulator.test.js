import { describe, it, expect } from 'vitest';
import {
  BASES,
  encodeQuantumState,
  measureQuantumState,
  aliceGenerateAndEncode,
  bobGenerateMeasurementBases,
  bobMeasureQuantumStates,
  reconcileBases,
  runBB84,
} from './quantumSimulator';

// Deterministic helper for testing mismatch randomness boundaries
function isBit(x) { return x === 0 || x === 1; }

describe('quantumSimulator BB84 core', () => {
  it('encodes states correctly for Z basis', () => {
    expect(encodeQuantumState(0, BASES.Z)).toBe('|0⟩');
    expect(encodeQuantumState(1, BASES.Z)).toBe('|1⟩');
  });

  it('encodes states correctly for X basis', () => {
    expect(encodeQuantumState(0, BASES.X)).toBe('|+⟩');
    expect(encodeQuantumState(1, BASES.X)).toBe('|-⟩');
  });

  it('measurement matches original bit when bases match', () => {
    expect(measureQuantumState(0, 'Z', 'Z')).toBe(0);
    expect(measureQuantumState(1, 'X', 'X')).toBe(1);
  });

  it('measurement yields a bit when bases mismatch', () => {
    const r = measureQuantumState(0, 'Z', 'X');
    expect(isBit(r)).toBe(true);
  });

  it('Alice and Bob pipeline produces arrays of equal length', () => {
    const n = 32;
    const alice = aliceGenerateAndEncode(n);
    const bobBases = bobGenerateMeasurementBases(n);
    const { results } = bobMeasureQuantumStates(alice.bits, alice.bases, bobBases);
    expect(alice.bits.length).toBe(n);
    expect(alice.bases.length).toBe(n);
    expect(bobBases.length).toBe(n);
    expect(results.length).toBe(n);
  });

  it('Reconciliation produces matching keys for matching indices', () => {
    // Forcefully create a scenario where half bases match
    const aliceBases = Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? 'Z' : 'X'));
    const bobBases   = Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? 'Z' : 'Z'));
    const aliceBits  = Array.from({ length: 10 }, () => 0);
    const bobResults = Array.from({ length: 10 }, (_, i) => (aliceBases[i] === bobBases[i] ? 0 : 1));
    const recon = reconcileBases(aliceBases, bobBases, aliceBits, bobResults);
    expect(recon.aliceKeyBits).toEqual(recon.bobKeyBits);
    expect(recon.keysMatch).toBe(true);
  });

  it('Edge case: all bases match yields full-length key that matches', () => {
    const n = 16;
    const aliceBases = Array.from({ length: n }, () => 'Z');
    const bobBases = Array.from({ length: n }, () => 'Z');
    const aliceBits = Array.from({ length: n }, (_, i) => (i % 2));
    const bobResults = aliceBits.slice();
    const recon = reconcileBases(aliceBases, bobBases, aliceBits, bobResults);
    expect(recon.keyLength).toBe(n);
    expect(recon.keysMatch).toBe(true);
    expect(recon.valid).toBe(true);
  });

  it('Edge case: no bases match yields empty key and invalid session', () => {
    const n = 16;
    const aliceBases = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 'Z' : 'X'));
    const bobBases = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 'X' : 'Z'));
    const aliceBits = Array.from({ length: n }, () => 1);
    const bobResults = Array.from({ length: n }, () => 0);
    const recon = reconcileBases(aliceBases, bobBases, aliceBits, bobResults);
    expect(recon.keyLength).toBe(0);
    expect(recon.keysMatch).toBe(true); // empty arrays match
    expect(recon.valid).toBe(false);
  });

  it('runBB84 returns a valid or invalid session with proper fields', () => {
    const s = runBB84(32);
    expect(Array.isArray(s.aliceBits)).toBe(true);
    expect(Array.isArray(s.bobResults)).toBe(true);
    expect(Array.isArray(s.aliceKeyBits)).toBe(true);
    expect(typeof s.valid).toBe('boolean');
  });
});
