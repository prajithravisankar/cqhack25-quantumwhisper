/**
 * Test script to verify the file-based quantum key exchange workflow
 * This script tests the complete encode → WAV file → decode cycle
 */

import { initGGWave, encodeWithGGWave, decodeWithGGWave, convertQuantumKeyToTransmittable, unpackQuantumKeyPayload } from './ggwaveWrapper.js';
import { samplesToWavBlob, readAudioFile } from './audioFileUtils.js';

export async function testFileBasedWorkflow() {
  console.log('🧪 Starting file-based workflow test...');
  
  try {
    // 1. Create test quantum key
    const testKeyBits = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0];
    console.log('🧪 Test key bits:', testKeyBits);
    
    // 2. Convert to transmittable format
    const payload = convertQuantumKeyToTransmittable(testKeyBits);
    console.log('🧪 Generated payload:', payload);
    
    // 3. Encode with GGWave
    const audioSamples = await encodeWithGGWave(payload);
    console.log('🧪 Audio samples generated:', audioSamples?.length);
    
    if (!audioSamples || audioSamples.length === 0) {
      throw new Error('Failed to generate audio samples');
    }
    
    // 4. Convert to WAV blob (simulate file creation)
    const float32Samples = new Float32Array(audioSamples);
    const wavBlob = samplesToWavBlob(float32Samples, 48000);
    console.log('🧪 WAV blob created:', wavBlob.size, 'bytes');
    
    // 5. Simulate file reading by converting blob back to audio buffer
    const arrayBuffer = await wavBlob.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const readSamples = audioBuffer.getChannelData(0);
    console.log('🧪 Read samples from WAV:', readSamples?.length);
    
    // 6. Decode the read samples
    const decodedText = decodeWithGGWave(readSamples);
    console.log('🧪 Decoded text:', decodedText);
    
    if (!decodedText) {
      throw new Error('Failed to decode audio samples');
    }
    
    // 7. Unpack the quantum key
    const unpackedData = unpackQuantumKeyPayload(decodedText);
    console.log('🧪 Unpacked data:', unpackedData);
    
    if (!unpackedData || !unpackedData.bits) {
      throw new Error('Failed to unpack quantum key payload');
    }
    
    // 8. Compare with original
    const receivedBits = unpackedData.bits;
    console.log('🧪 Received bits:', receivedBits);
    console.log('🧪 Original bits:', testKeyBits);
    
    const isMatch = testKeyBits.length === receivedBits.length && 
                   testKeyBits.every((bit, i) => bit === receivedBits[i]);
    
    if (isMatch) {
      console.log('🧪 ✅ SUCCESS: File-based workflow test passed!');
      return {
        success: true,
        originalBits: testKeyBits,
        receivedBits: receivedBits,
        payload: payload,
        wavSize: wavBlob.size
      };
    } else {
      console.log('🧪 ❌ FAIL: Received bits do not match original');
      return {
        success: false,
        error: 'Bit mismatch',
        originalBits: testKeyBits,
        receivedBits: receivedBits
      };
    }
    
  } catch (error) {
    console.error('🧪 ❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.testFileBasedWorkflow = testFileBasedWorkflow;
}
