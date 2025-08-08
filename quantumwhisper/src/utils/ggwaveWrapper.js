import GGWave from 'ggwave';

// Default GGWave configuration (tuned for browser playback & mic capture)
const DEFAULT_GGWAVE_OPTS = {
  // Placeholder for future tuning; keeping compatibility with current API
  // e.g. sampleRate: 48000, protocolId: 1
};

let singletonGGWave = null;
function getGGWaveInstance(opts = {}) {
  if (!singletonGGWave) {
    singletonGGWave = new GGWave({ ...DEFAULT_GGWAVE_OPTS, ...opts });
  }
  return singletonGGWave;
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

// Pack/Unpack payload for quantum key bits
export function packQuantumKeyPayload(bitsArray) {
  const payload = {
    v: 1,
    t: 'qkey',
    ts: Date.now(),
    bits: Array.isArray(bitsArray) ? bitsArray.join('') : '',
  };
  const json = JSON.stringify(payload);
  return toBase64(json);
}

export function unpackQuantumKeyPayload(b64) {
  const clean = sanitizeBase64(b64);
  const json = fromBase64(clean);
  try {
    const obj = JSON.parse(json);
    if (obj?.t !== 'qkey' || typeof obj?.bits !== 'string') return null;
    const bits = obj.bits.split('').map((c) => (c === '1' ? 1 : 0));
    return { ...obj, bits };
  } catch {
    return null;
  }
}

// Audio playback using Web Audio API
export async function playSamples(samples, { sampleRate = 48000, onStart, onEnd, onError } = {}) {
  try {
    if (!samples || samples.length === 0) throw new Error('No audio samples to play');
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error('Web Audio API not supported');

    const ctx = new AudioCtx();
    const buffer = ctx.createBuffer(1, samples.length, sampleRate);
    const channel = buffer.getChannelData(0);

    // Normalize and copy into buffer (assuming Float32 or number[])
    for (let i = 0; i < samples.length; i++) {
      const v = typeof samples[i] === 'number' ? samples[i] : 0;
      channel[i] = Math.max(-1, Math.min(1, v));
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);

    onStart && onStart();
    src.start();

    await new Promise((res) => {
      src.onended = res;
    });

    src.disconnect();
    ctx.close();
    onEnd && onEnd();
  } catch (err) {
    onError && onError(err);
    throw err;
  }
}

// Encode/decode via GGWave
export function encodeWithGGWave(data, opts = {}) {
  const ggwave = getGGWaveInstance(opts);
  return ggwave.encode(data);
}

export function decodeWithGGWave(soundWave, opts = {}) {
  try {
    const ggwave = getGGWaveInstance(opts);
    return ggwave.decode(soundWave);
  } catch (err) {
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
      const samples = encodeWithGGWave(payloadB64, ggwaveOptions);
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

    const ggwave = getGGWaveInstance(ggwaveOptions);
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
          // Convert Float32 samples [-1,1] to 16-bit PCM for decoder if needed
          const int16 = new Int16Array(dataArray.length);
          for (let i = 0; i < dataArray.length; i++) {
            let s = Math.max(-1, Math.min(1, dataArray[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          const decoded = ggwave.decode(int16);
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