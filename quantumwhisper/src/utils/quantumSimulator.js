/**
 * Simulates quantum key generation using the BB84 protocol.
 * @returns {Array} Simulated quantum key
 */
export const simulateQuantumKey = (length = 32) => {
  // Use the full BB84 session to derive the key bits
  const session = runBB84(length);
  return session.aliceKeyBits;
};

// Quantum bit states for BB84 protocol
export const QUBIT_STATES = {
  ZERO: '|0⟩',   // Z-basis, bit 0
  ONE: '|1⟩',    // Z-basis, bit 1
  PLUS: '|+⟩',   // X-basis, bit 0
  MINUS: '|-⟩',  // X-basis, bit 1
};

// Basis representation
export const BASES = {
  Z: 'Z', // 0/1 basis
  X: 'X', // +/- basis
};

// Helper to randomly select a basis
export function getRandomBasis() {
  return Math.random() < 0.5 ? BASES.Z : BASES.X;
}

/**
 * Encodes a classical bit and basis into a quantum state symbol.
 * @param {number} bit - 0 or 1
 * @param {'Z'|'X'} basis - 'Z' or 'X'
 * @returns {string} Quantum state symbol
 */
export function encodeQuantumState(bit, basis) {
  if (basis === BASES.Z) {
    return bit === 0 ? QUBIT_STATES.ZERO : QUBIT_STATES.ONE;
  } else if (basis === BASES.X) {
    return bit === 0 ? QUBIT_STATES.PLUS : QUBIT_STATES.MINUS;
  }
  throw new Error('Invalid basis');
}

/**
 * Simulates quantum measurement.
 * @param {number} bit - The original bit (0 or 1)
 * @param {'Z'|'X'} prepBasis - Preparation basis ('Z' or 'X')
 * @param {'Z'|'X'} measBasis - Measurement basis ('Z' or 'X')
 * @returns {number} Measured bit (0 or 1)
 */
export function measureQuantumState(bit, prepBasis, measBasis) {
  if (prepBasis === measBasis) {
    // Bases match: measurement yields original bit
    return bit;
  } else {
    // Bases differ: measurement yields random bit
    return Math.random() < 0.5 ? 0 : 1;
  }
}

/**
 * Generates a random bit sequence of given length.
 * @param {number} length
 * @returns {number[]} Array of 0s and 1s
 */
export function generateRandomBits(length = 32) {
  return Array.from({ length }, () => (Math.random() < 0.5 ? 0 : 1));
}


/**
 * Generates a random basis sequence of given length.
 * @param {number} length
 * @returns {('Z'|'X')[]} Array of 'Z' or 'X'
 */
export function generateRandomBases(length = 32) {
  return Array.from({ length }, () => getRandomBasis());
}

/**
 * Encodes a bit sequence and basis sequence into quantum states.
 * @param {number[]} bits
 * @param {('Z'|'X')[]} bases
 * @returns {string[]} Array of quantum state symbols
 */
export function encodeQuantumStates(bits, bases) {
  if (!Array.isArray(bits) || !Array.isArray(bases) || bits.length !== bases.length) {
    throw new Error('encodeQuantumStates: bits and bases must be arrays of equal length');
  }
  return bits.map((bit, i) => encodeQuantumState(bit, bases[i]));
}

/**
 * Alice: Generate random bits & bases, then encode into quantum states.
 * @param {number} length - Number of qubits to prepare (default 32)
 * @returns {{ bits: number[], bases: ('Z'|'X')[], quantumStates: string[] }}
 */
export function aliceGenerateAndEncode(length = 32) {
  const bits = generateRandomBits(length);
  const bases = generateRandomBases(length);
  const quantumStates = encodeQuantumStates(bits, bases);
  return { bits, bases, quantumStates };
}

/**
 * Bob: Generate random measurement bases.
 * @param {number} length
 * @returns {('Z'|'X')[]}
 */
export function bobGenerateMeasurementBases(length = 32) {
  return generateRandomBases(length);
}

/**
 * Bob: Measure received qubits (simulated) given Alice's original bits & bases and Bob's measurement bases.
 * If bases match, result equals Alice's bit; otherwise random (handled by measureQuantumState).
 * @param {number[]} aliceBits
 * @param {('Z'|'X')[]} aliceBases
 * @param {('Z'|'X')[]} bobBases
 * @returns {{ results: number[], bobBases: ('Z'|'X')[] }}
 */
export function bobMeasureQuantumStates(aliceBits, aliceBases, bobBases) {
  if (
    !Array.isArray(aliceBits) ||
    !Array.isArray(aliceBases) ||
    !Array.isArray(bobBases) ||
    aliceBits.length !== aliceBases.length ||
    aliceBits.length !== bobBases.length
  ) {
    throw new Error('bobMeasureQuantumStates: inputs must be arrays of equal length');
  }

  const results = aliceBits.map((bit, i) => measureQuantumState(bit, aliceBases[i], bobBases[i]));
  return { results, bobBases };
}

/**
 * Compare Alice's preparation bases with Bob's measurement bases and derive the shared key from matching indices.
 * Ensures a minimum key length of 16 bits.
 * @param {('Z'|'X')[]} aliceBases
 * @param {('Z'|'X')[]} bobBases
 * @param {number[]} aliceBits
 * @param {number[]} bobResults
 * @returns {{
 *   matchingIndices: number[],
 *   aliceKeyBits: number[],
 *   bobKeyBits: number[],
 *   keysMatch: boolean,
 *   keyLength: number,
 *   valid: boolean,
 * }}
 */
export function reconcileBases(aliceBases, bobBases, aliceBits, bobResults) {
  if (
    !Array.isArray(aliceBases) ||
    !Array.isArray(bobBases) ||
    !Array.isArray(aliceBits) ||
    !Array.isArray(bobResults) ||
    aliceBases.length !== bobBases.length ||
    aliceBases.length !== aliceBits.length ||
    aliceBases.length !== bobResults.length
  ) {
    throw new Error('reconcileBases: all inputs must be arrays of equal length');
  }

  const matchingIndices = [];
  for (let i = 0; i < aliceBases.length; i++) {
    if (aliceBases[i] === bobBases[i]) matchingIndices.push(i);
  }

  const aliceKeyBits = matchingIndices.map((i) => aliceBits[i]);
  const bobKeyBits = matchingIndices.map((i) => bobResults[i]);

  const keysMatch = arraysEqual(aliceKeyBits, bobKeyBits);
  const keyLength = aliceKeyBits.length;
  const valid = keyLength >= 16; // MVP requirement

  return { matchingIndices, aliceKeyBits, bobKeyBits, keysMatch, keyLength, valid };
}

/**
 * Helper: Compare two number arrays for equality.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {boolean}
 */
export function arraysEqual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * Helper: Convert bit array to string (e.g., [1,0,1] -> "101").
 * @param {number[]} bits
 * @returns {string}
 */
export function bitsToString(bits) {
  return (bits || []).join('');
}

/**
 * Run a full BB84 session: Alice prepares, Bob measures, bases are reconciled to derive a key.
 * @param {number} length - Number of qubits to use (default 32)
 * @returns {{
 *   length: number,
 *   aliceBits: number[],
 *   aliceBases: ('Z'|'X')[],
 *   bobBases: ('Z'|'X')[],
 *   bobResults: number[],
 *   matchingIndices: number[],
 *   aliceKeyBits: number[],
 *   bobKeyBits: number[],
 *   keysMatch: boolean,
 *   keyLength: number,
 *   valid: boolean,
 *   keyStringAlice: string,
 *   keyStringBob: string,
 * }}
 */
export function runBB84(length = 32) {
  const alice = aliceGenerateAndEncode(length);
  const bobBases = bobGenerateMeasurementBases(length);
  const { results: bobResults } = bobMeasureQuantumStates(alice.bits, alice.bases, bobBases);
  const recon = reconcileBases(alice.bases, bobBases, alice.bits, bobResults);

  return {
    length,
    aliceBits: alice.bits,
    aliceBases: alice.bases,
    bobBases,
    bobResults,
    matchingIndices: recon.matchingIndices,
    aliceKeyBits: recon.aliceKeyBits,
    bobKeyBits: recon.bobKeyBits,
    keysMatch: recon.keysMatch,
    keyLength: recon.keyLength,
    valid: recon.valid,
    keyStringAlice: bitsToString(recon.aliceKeyBits),
    keyStringBob: bitsToString(recon.bobKeyBits),
  };
}

export default {
  QUBIT_STATES,
  BASES,
  getRandomBasis,
  encodeQuantumState,
  measureQuantumState,
  generateRandomBits,
  generateRandomBases,
  encodeQuantumStates,
  aliceGenerateAndEncode,
  bobGenerateMeasurementBases,
  bobMeasureQuantumStates,
  reconcileBases,
  arraysEqual,
  bitsToString,
  runBB84,
};