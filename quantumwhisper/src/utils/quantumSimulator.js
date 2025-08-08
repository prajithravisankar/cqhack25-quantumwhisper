/**
 * Simulates quantum key generation using the BB84 protocol.
 * @returns {Array} Simulated quantum key
 */
export const simulateQuantumKey = () => {
  // Placeholder for quantum key simulation logic
  return [0, 1, 1, 0, 1]; // Example key
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

export default {
  QUBIT_STATES,
  BASES,
  getRandomBasis,
  encodeQuantumState,
  measureQuantumState,
};