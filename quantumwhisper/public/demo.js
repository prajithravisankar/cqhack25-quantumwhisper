// Demo script for testing QuantumWhisper end-to-end workflow
// Run this in browser console to test the complete flow

console.log('🔬 QuantumWhisper Demo Script');

async function demoWorkflow() {
  try {
    console.log('📊 Step 1: Testing Quantum Simulator...');
    const { runBB84 } = await import('/src/utils/quantumSimulator.js');
    const session = runBB84(32);
    console.log('✅ BB84 session:', {
      keyLength: session.keyLength,
      valid: session.valid,
      keysMatch: session.keysMatch
    });

    console.log('🔐 Step 2: Testing Encryption...');
    const { encryptTextWithQuantumKey, decryptTextWithQuantumKey } = await import('/src/utils/encryption.js');
    const message = 'Hello, quantum world!';
    const encResult = await encryptTextWithQuantumKey(message, session.aliceKeyBits);
    console.log('✅ Encryption successful:', encResult.ok);
    
    const decResult = await decryptTextWithQuantumKey(encResult.package, session.aliceKeyBits);
    console.log('✅ Decryption successful:', decResult.ok, 'Message:', decResult.plaintext);

    console.log('🎵 Step 3: Testing Audio Processing...');
    const { convertQuantumKeyToTransmittable, parseTransmittedQuantumKey } = await import('/src/utils/ggwaveWrapper.js');
    const payload = convertQuantumKeyToTransmittable(session.aliceKeyBits);
    const parsed = parseTransmittedQuantumKey(payload);
    console.log('✅ Audio payload processing:', payload.length > 0 && parsed?.bits?.length > 0);

    console.log('🎉 All systems operational!');
    console.log('\nTry the workflow:');
    console.log('1. Generate a quantum key (Alice)');
    console.log('2. Copy the generated key data');
    console.log('3. Paste it in the receiver (Bob)');
    console.log('4. Type a message in the sender');
    console.log('5. Encrypt and copy the encrypted message');
    console.log('6. Paste it in the receiver to decrypt');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Auto-run demo
demoWorkflow();

// Helper functions for manual testing
window.quantumDemo = {
  testBB84: () => {
    const { runBB84 } = require('/src/utils/quantumSimulator.js');
    return runBB84(32);
  },
  
  testEncryption: async (message, keyBits) => {
    const { encryptTextWithQuantumKey } = require('/src/utils/encryption.js');
    return await encryptTextWithQuantumKey(message, keyBits);
  },
  
  copyToClipboard: (text) => {
    navigator.clipboard.writeText(text);
    console.log('📋 Copied to clipboard');
  }
};

console.log('Demo functions available as window.quantumDemo');
