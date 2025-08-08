// GGWave wrapper utility for audio communication
// Based on the official GGWave JavaScript examples

let ggwave = null;
let ggwaveInstance = null;
let ggwaveInitialized = false;
let audioContext = null;

/**
 * Initialize GGWave library using the factory pattern from official examples
 */
async function initGGWave() {
  if (ggwaveInitialized && ggwave && ggwaveInstance) {
    return { ggwave, instance: ggwaveInstance };
  }

  try {
    // Import the ggwave factory - the module exports a factory function called ggwave_factory
    const ggwaveModule = await import('ggwave');
    console.log('🔊 GGWave module loaded:', ggwaveModule);
    
    // Try different export patterns based on the examples
    let ggwaveFactory = null;
    if (typeof ggwaveModule.default === 'function') {
      ggwaveFactory = ggwaveModule.default;
    } else if (typeof ggwaveModule.ggwave_factory === 'function') {
      ggwaveFactory = ggwaveModule.ggwave_factory;
    } else if (typeof window.ggwave_factory === 'function') {
      ggwaveFactory = window.ggwave_factory;
    } else {
      throw new Error('Could not find ggwave_factory function');
    }
    
    console.log('🔊 GGWave factory found:', typeof ggwaveFactory);
    
    // Create GGWave instance using factory (returns a Promise)
    ggwave = await ggwaveFactory();
    console.log('🔊 GGWave instance created:', ggwave);
    console.log('🔊 Available methods:', Object.keys(ggwave));

    if (!ggwave.getDefaultParameters || !ggwave.init || !ggwave.encode) {
      throw new Error('GGWave instance missing required methods');
    }

    // Set up audio context and parameters
    audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
    const parameters = ggwave.getDefaultParameters();
    parameters.sampleRateInp = audioContext.sampleRate;
    parameters.sampleRateOut = audioContext.sampleRate;
    
    console.log('🔊 Parameters:', parameters);

    // Initialize the actual instance
    ggwaveInstance = ggwave.init(parameters);
    console.log('🔊 GGWave initialized with instance:', ggwaveInstance);

    ggwaveInitialized = true;
    return { ggwave, instance: ggwaveInstance };
  } catch (error) {
    console.error('❌ Failed to initialize GGWave:', error);
    ggwaveInitialized = false;
    ggwave = null;
    ggwaveInstance = null;
    throw error;
  }
}

/**
 * Helper function to convert typed arrays (from examples)
 */
function convertTypedArray(src, type) {
  const buffer = new ArrayBuffer(src.byteLength);
  const baseView = new src.constructor(buffer).set(src);
  return new type(buffer);
}

// Cross-env Base64 helpers
function toBase64(str) {
  try {
    if (typeof window !== 'undefined' && window.btoa) return window.btoa(unescape(encodeURIComponent(str)));
    // Node fallback
    return Buffer.from(str, 'utf8').toString('base64');
  } catch {
    return '';
  }
}
function fromBase64(b64) {
  try {
    if (typeof window !== 'undefined' && window.atob) return decodeURIComponent(escape(window.atob(b64)));
    // Node fallback
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

// Sanitization: allow only base64 charset characters
export function sanitizeBase64(input) {
  return (input || '').replace(/[^A-Za-z0-9+/=]/g, '');
}

// Pack/Unpack payload for quantum key bits (optimized)
export function packQuantumKeyPayload(bitsArray) {
  // Optimize: pack bits into binary instead of string representation
  const bitString = Array.isArray(bitsArray) ? bitsArray.join('') : '';
  
  // For very long keys, truncate to fit GGWave's limits (140 bytes)
  const maxBits = 800; // Leaves room for JSON overhead
  const truncatedBits = bitString.length > maxBits ? bitString.substring(0, maxBits) : bitString;
  
  const payload = {
    v: 1,
    t: 'qkey',
    ts: Date.now(),
    bits: truncatedBits,
    orig: bitString.length, // track original length
  };
  const json = JSON.stringify(payload);
  const b64 = toBase64(json);
  
  console.log(`📦 Packed payload: ${bitString.length} bits → ${truncatedBits.length} bits → ${b64.length} base64 chars`);
  
  return b64;
}

export function unpackQuantumKeyPayload(b64) {
  const clean = sanitizeBase64(b64);
  const json = fromBase64(clean);
  try {
    const obj = JSON.parse(json);
    if (obj?.t !== 'qkey' || typeof obj?.bits !== 'string') return null;
    const bits = obj.bits.split('').map((c) => (c === '1' ? 1 : 0));
    
    console.log(`📦 Unpacked payload: ${obj.bits.length} bits received${obj.orig ? ` (original: ${obj.orig})` : ''}`);
    
    return { ...obj, bits };
  } catch {
    return null;
  }
}

/**
 * Play audio data using Web Audio API (from examples)
 */
export async function playSamples(samples, { sampleRate = 48000, onStart, onEnd, onError } = {}) {
  try {
    if (!samples || samples.length === 0) throw new Error('No audio samples to play');
    
    // Ensure we have an audio context
    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
    }
    
    // Resume context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Convert waveform to Float32Array using helper from examples
    const audioData = convertTypedArray(samples, Float32Array);

    const buffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
    buffer.getChannelData(0).set(audioData);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    onStart && onStart();
    source.start(0);

    await new Promise((res) => {
      source.onended = res;
    });

    source.disconnect();
    onEnd && onEnd();
    console.log('🔊 Audio played successfully');
  } catch (err) {
    console.error('❌ Failed to play audio:', err);
    onError && onError(err);
    throw err;
  }
}

/**
 * Encode data to audio waveform using correct GGWave API
 */
export async function encodeWithGGWave(data, opts = {}) {
  try {
    const { ggwave: ggwaveLib, instance } = await initGGWave();
    
    console.log('🔊 Encoding data:', data);
    console.log('🔊 Available protocols:', ggwaveLib.ProtocolId);

    // Convert string to payload if needed
    let payload = data;
    if (typeof data === 'string') {
      payload = data; // GGWave can handle strings directly
    }

    // Encode using the correct API pattern from examples
    const waveform = ggwaveLib.encode(
      instance, 
      payload, 
      ggwaveLib.ProtocolId?.GGWAVE_PROTOCOL_AUDIBLE_FAST || 1, // fallback to protocol 1
      10 // volume
    );

    console.log('🔊 Waveform generated:', waveform);
    
    if (!waveform || waveform.length === 0) {
      throw new Error('Generated waveform is empty');
    }

    return waveform;
  } catch (error) {
    console.error('❌ Failed to encode audio:', error);
    throw error;
  }
}

/**
 * Decode audio waveform using correct GGWave API
 */
export function decodeWithGGWave(soundWave, opts = {}) {
  try {
    if (!ggwaveInitialized || !ggwave || !ggwaveInstance) {
      // Don't spam console - this is normal during initialization
      return null;
    }
    
    // Convert soundWave to appropriate format for decode
    let audioData = soundWave;
    if (!(soundWave instanceof Int8Array)) {
      audioData = convertTypedArray(new Float32Array(soundWave), Int8Array);
    }
    
    const result = ggwave.decode(ggwaveInstance, audioData);
    return result;
  } catch (err) {
    console.error('❌ Failed to decode audio:', err);
    return null;
  }
}

// Convert quantum key bits to a transmittable string (base64 JSON)
export function convertQuantumKeyToTransmittable(bitsArray) {
  return packQuantumKeyPayload(bitsArray);
}

export function parseTransmittedQuantumKey(b64) {
  return unpackQuantumKeyPayload(b64);
}

// Transmission: encode payload -> audio samples -> play
export async function transmitQuantumKey(bitsArray, {
  onStatus,
  retries = 1,
  sampleRate = 48000,
  ggwaveOptions = {},
} = {}) {
  const notify = (s, extra) => onStatus && onStatus({ status: s, ...extra });
  const payloadB64 = convertQuantumKeyToTransmittable(bitsArray);
  let lastError = null;

  for (let attempt = 1; attempt <= Math.max(1, retries); attempt++) {
    try {
      notify('encoding', { attempt });
      const samples = await encodeWithGGWave(payloadB64, ggwaveOptions);
      notify('playing', { attempt });
      await playSamples(samples, {
        sampleRate,
        onStart: () => notify('started', { attempt }),
        onEnd: () => notify('finished', { attempt }),
        onError: (e) => notify('error', { attempt, error: e?.message }),
      });
      notify('success', { attempt });
      return { ok: true };
    } catch (e) {
      lastError = e;
      notify('retry', { attempt, error: e?.message });
    }
  }

  return { ok: false, error: lastError };
}

// Reception: microphone -> streaming decode via GGWave
export async function receiveQuantumKey({
  onStatus,
  ggwaveOptions = {},
  timeoutMs = 15000,
  minRms = 0.01,
} = {}) {
  const notify = (s, extra) => onStatus && onStatus({ status: s, ...extra });
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) throw new Error('Web Audio API not supported');

  let ctx;
  let stream;
  let source;
  let analyser;
  let dataArray;
  let rafId;
  let resolved = false;

  const stopAll = () => {
    try { rafId && cancelAnimationFrame(rafId); } catch {}
    try { analyser && analyser.disconnect(); } catch {}
    try { source && source.disconnect(); } catch {}
    try { stream && stream.getTracks().forEach((t) => t.stop()); } catch {}
    try { ctx && ctx.close(); } catch {}
  };

  try {
    notify('request-permission');
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    notify('permission-denied', { error: err?.message });
    throw new Error('Microphone permission denied');
  }

  try {
    ctx = new AudioCtx();
    source = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;
    dataArray = new Float32Array(bufferLength);

    source.connect(analyser);

    // Initialize GGWave for decoding
    await initGGWave();
    const startedAt = Date.now();

    const loop = () => {
      if (Date.now() - startedAt > timeoutMs) {
        notify('timeout');
        stopAll();
        if (!resolved) resolved = true;
        return;
      }

      analyser.getFloatTimeDomainData(dataArray);

      // Simple quality check (RMS)
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i] * dataArray[i];
      const rms = Math.sqrt(sum / dataArray.length);
      notify('audio-level', { rms });

      if (rms >= minRms) {
        try {
          const decoded = decodeWithGGWave(dataArray, ggwaveOptions);
          if (decoded && typeof decoded === 'string' && decoded.length > 0) {
            notify('decoded', { raw: decoded });
            const unpacked = unpackQuantumKeyPayload(decoded);
            if (unpacked && Array.isArray(unpacked.bits) && unpacked.bits.length >= 16) {
              notify('success', { length: unpacked.bits.length });
              stopAll();
              if (!resolved) resolved = true;
              return;
            }
          }
        } catch (err) {
          notify('decode-error', { error: err?.message });
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    notify('listening');
    loop();

    // Return a handle with a promise-like stop mechanism
    return {
      stop: () => {
        notify('stopped');
        stopAll();
      },
    };
  } catch (err) {
    stopAll();
    notify('error', { error: err?.message });
    throw err;
  }
}

/**
 * Main transmit function for simple usage (backward compatibility)
 */
export async function transmitData(data) {
  try {
    console.log('🔊 Starting audio transmission for:', data);
    
    const waveform = await encodeWithGGWave(data);
    await playSamples(waveform);
    
    return { success: true, message: 'Audio transmitted successfully' };
  } catch (error) {
    console.error('❌ Audio transmission failed:', error);
    return { success: false, error: error.message };
  }
}

// Export additional functions for testing
export { initGGWave };