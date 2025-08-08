// Simple audio test utilities
// These functions can be used when GGWave isn't working properly

export async function playTestTone(frequency = 440, duration = 1000) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error('Web Audio API not supported');

    const ctx = new AudioCtx();
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = 'sine';

    // Fade in/out to avoid clicks
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + duration / 1000 - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);

    return new Promise((resolve) => {
      oscillator.onended = () => {
        ctx.close();
        resolve();
      };
    });
  } catch (error) {
    console.error('Audio test failed:', error);
    throw error;
  }
}

export async function playQuantumKeyAudio(keyBits) {
  // Play a sequence of tones based on key bits
  // 0 = low tone, 1 = high tone
  const baseTone = 440;
  const toneDuration = 200;
  
  for (let i = 0; i < Math.min(keyBits.length, 8); i++) {
    const frequency = keyBits[i] ? baseTone * 2 : baseTone;
    await playTestTone(frequency, toneDuration);
    await new Promise(resolve => setTimeout(resolve, 50)); // Small gap
  }
}

export function generateAudioPayload(keyBits) {
  // Create a simple string representation that can be copied/pasted
  const payload = {
    version: 1,
    type: 'quantum_key',
    timestamp: Date.now(),
    bits: keyBits,
    length: keyBits.length
  };
  
  return JSON.stringify(payload);
}

export function parseAudioPayload(payloadString) {
  try {
    const payload = JSON.parse(payloadString);
    if (payload.type === 'quantum_key' && Array.isArray(payload.bits)) {
      return payload.bits;
    }
    return null;
  } catch {
    return null;
  }
}
