/**
 * Test script to verify quantum key generation always produces at least 16 bits
 */

import { simulateQuantumKey, runBB84WithMinKeyLength, runBB84 } from './quantumSimulator.js';

console.log('🧪 Testing Quantum Key Generation...\n');

// Test 1: simulateQuantumKey with default minimum (16 bits)
console.log('=== Test 1: simulateQuantumKey (default 16 bits) ===');
for (let i = 1; i <= 10; i++) {
  const key = simulateQuantumKey();
  const success = key.length >= 16;
  console.log(`Attempt ${i}: ${key.length} bits ${success ? '✓' : '✗'}`);
  if (!success) {
    console.error(`❌ FAILED: Key too short (${key.length} < 16)`);
  }
}

// Test 2: simulateQuantumKey with higher minimum (32 bits)
console.log('\n=== Test 2: simulateQuantumKey (32 bits minimum) ===');
for (let i = 1; i <= 5; i++) {
  const key = simulateQuantumKey(32);
  const success = key.length >= 32;
  console.log(`Attempt ${i}: ${key.length} bits ${success ? '✓' : '✗'}`);
  if (!success) {
    console.error(`❌ FAILED: Key too short (${key.length} < 32)`);
  }
}

// Test 3: runBB84WithMinKeyLength
console.log('\n=== Test 3: runBB84WithMinKeyLength ===');
for (let i = 1; i <= 5; i++) {
  const session = runBB84WithMinKeyLength(16);
  const success = session.keyLength >= 16;
  console.log(`Attempt ${i}: ${session.keyLength} bits, ${session.attempts} attempts, ${session.finalQubitCount} qubits ${success ? '✓' : '✗'}`);
  if (!success) {
    console.error(`❌ FAILED: Key too short (${session.keyLength} < 16)`);
  }
}

// Test 4: Edge case - very small qubit count (should still work due to retry logic)
console.log('\n=== Test 4: Edge Case Tests ===');
console.log('Testing with various minimum key lengths...');

for (const minLength of [8, 16, 24, 32]) {
  const key = simulateQuantumKey(minLength);
  const success = key.length >= minLength;
  console.log(`Min ${minLength} bits: Got ${key.length} bits ${success ? '✓' : '✗'}`);
}

// Test 5: Statistical analysis
console.log('\n=== Test 5: Statistical Analysis (100 runs) ===');
const results = [];
for (let i = 0; i < 100; i++) {
  const key = simulateQuantumKey(16);
  results.push(key.length);
}

const minLength = Math.min(...results);
const maxLength = Math.max(...results);
const avgLength = results.reduce((a, b) => a + b, 0) / results.length;
const successRate = results.filter(len => len >= 16).length / results.length * 100;

console.log(`Min length: ${minLength} bits`);
console.log(`Max length: ${maxLength} bits`);
console.log(`Average length: ${avgLength.toFixed(1)} bits`);
console.log(`Success rate (≥16 bits): ${successRate}%`);

if (successRate === 100) {
  console.log('✅ ALL TESTS PASSED! Quantum key generation is reliable.');
} else {
  console.error(`❌ FAILURE: Only ${successRate}% success rate`);
}

console.log('\n🏁 Testing complete!');
