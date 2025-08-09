/**
 * Audio file utilities for quantum key exchange
 * Handles WAV file generation and audio file processing
 */

/**
 * Convert audio samples to WAV file blob
 * Handles both Int8Array and Float32Array inputs
 */
export function samplesToWavBlob(samples, sampleRate = 48000) {
  console.log('🎵 WAV: Converting samples to WAV, input type:', samples?.constructor?.name);
  console.log('🎵 WAV: Sample count:', samples?.length);
  
  // Find min/max without spreading the array
  let min = samples[0], max = samples[0];
  for (let i = 1; i < Math.min(1000, samples.length); i++) { // Sample first 1000 elements
    if (samples[i] < min) min = samples[i];
    if (samples[i] > max) max = samples[i];
  }
  console.log('🎵 WAV: Sample range (first 1000):', `${min} to ${max}`);
  
  // Convert input to Float32Array if needed
  let float32Samples;
  if (samples instanceof Int8Array) {
    console.log('🎵 WAV: Converting Int8Array to Float32Array...');
    float32Samples = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      // Convert Int8 (-128 to 127) to Float32 (-1 to 1)
      float32Samples[i] = samples[i] / 127.0;
    }
  } else {
    console.log('🎵 WAV: Using samples as Float32Array...');
    float32Samples = new Float32Array(samples);
  }
  
  const length = float32Samples.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, float32Samples[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  console.log('🎵 WAV: Generated WAV blob, size:', arrayBuffer.byteLength);
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Helper function to write string to DataView
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Trigger download of a WAV file
 */
export function downloadWavFile(samples, filename = 'quantum-key-audio.wav', sampleRate = 48000) {
  const blob = samplesToWavBlob(samples, sampleRate);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Read audio file and convert to Float32Array samples
 */
export async function readAudioFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        
        // Create audio context for decoding
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Decode audio file
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get samples from first channel
        const samples = audioBuffer.getChannelData(0);
        
        // Return copy of Float32Array
        resolve(new Float32Array(samples));
      } catch (error) {
        reject(new Error(`Failed to decode audio file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Create file input element for audio upload
 */
export function createAudioFileInput(onFileSelected) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'audio/*,.wav';
  input.style.display = 'none';
  
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelected(file);
    }
  };
  
  return input;
}

/**
 * Trigger file upload dialog
 */
export function triggerAudioFileUpload(onFileSelected) {
  const input = createAudioFileInput(onFileSelected);
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}
