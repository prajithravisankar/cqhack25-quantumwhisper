// Remove legacy CryptoJS import and simple AES helpers

// AES-256-GCM encryption utilities using Web Crypto API with PBKDF2 key derivation

// ---------- Helpers ----------
const te = new TextEncoder();
const td = new TextDecoder();

export function randomBytes(len = 16) {
  const arr = new Uint8Array(len);
  globalThis.crypto.getRandomValues(arr);
  return arr;
}

export function toBase64(bytes) {
  if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes);
  if (typeof window !== 'undefined' && window.btoa) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  }
  // Node
  return Buffer.from(bytes).toString('base64');
}

export function fromBase64(b64) {
  if (typeof window !== 'undefined' && window.atob) {
    const binary = window.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  // Node
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

export function sanitizeBase64(input) {
  return (input || '').replace(/[^A-Za-z0-9+/=]/g, '');
}

export function assertKeyBits(bits) {
  if (!Array.isArray(bits) || bits.length < 16 || !bits.every((b) => b === 0 || b === 1)) {
    throw new Error('Invalid quantum key bits (expected array of 0/1, min length 16)');
  }
}

export function bitsToBytes(bits) {
  const padded = bits.slice();
  while (padded.length % 8 !== 0) padded.push(0);
  const out = new Uint8Array(padded.length / 8);
  for (let i = 0; i < out.length; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | (padded[i * 8 + j] & 1);
    }
    out[i] = byte;
  }
  return out;
}

// ---------- Key Derivation ----------
export async function importKeyMaterialFromBits(bits) {
  assertKeyBits(bits);
  const raw = bitsToBytes(bits);
  return globalThis.crypto.subtle.importKey('raw', raw, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
}

export async function deriveAesGcmKeyFromBits(bits, { salt, iterations = 100000 } = {}) {
  assertKeyBits(bits);
  const keyMaterial = await importKeyMaterialFromBits(bits);
  const _salt = salt instanceof Uint8Array ? salt : randomBytes(16);
  const key = await globalThis.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: _salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return { key, salt: _salt, iterations };
}

// ---------- Encryption / Decryption ----------
export async function encryptTextWithQuantumKey(plaintext, bits, { iv, salt, iterations = 100000, aad } = {}) {
  if (typeof plaintext !== 'string' || plaintext.length === 0) throw new Error('Plaintext is empty');
  const { key, salt: usedSalt, iterations: usedIter } = await deriveAesGcmKeyFromBits(bits, { salt, iterations });
  const _iv = iv instanceof Uint8Array ? iv : randomBytes(12);

  const algo = { name: 'AES-GCM', iv: _iv };
  if (aad) algo.additionalData = typeof aad === 'string' ? te.encode(aad) : aad;

  const ct = new Uint8Array(await globalThis.crypto.subtle.encrypt(algo, key, te.encode(plaintext)));

  const pkg = {
    v: 1,
    alg: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA256',
    iter: usedIter,
    iv: toBase64(_iv),
    salt: toBase64(usedSalt),
    ct: toBase64(ct),
  };

  return { ok: true, package: pkg, b64: toBase64(te.encode(JSON.stringify(pkg))) };
}

export function validateEncryptedPackage(obj) {
  try {
    return (
      obj &&
      obj.v === 1 &&
      obj.alg === 'AES-256-GCM' &&
      obj.kdf === 'PBKDF2-SHA256' &&
      typeof obj.iter === 'number' &&
      typeof obj.iv === 'string' &&
      typeof obj.salt === 'string' &&
      typeof obj.ct === 'string'
    );
  } catch {
    return false;
  }
}

export function parseEncryptedPackage(input) {
  try {
    const str = typeof input === 'string' && /^[A-Za-z0-9+/=]+$/.test(input)
      ? td.decode(fromBase64(input))
      : typeof input === 'string'
        ? input
        : JSON.stringify(input);
    const obj = JSON.parse(str);
    return validateEncryptedPackage(obj) ? obj : null;
  } catch {
    return null;
  }
}

export async function decryptTextWithQuantumKey(pkgOrB64, bits, { aad } = {}) {
  const pkg = parseEncryptedPackage(pkgOrB64);
  if (!pkg) throw new Error('Invalid encrypted package');

  const iv = fromBase64(pkg.iv);
  const salt = fromBase64(pkg.salt);
  const ct = fromBase64(pkg.ct);

  const { key } = await deriveAesGcmKeyFromBits(bits, { salt, iterations: pkg.iter });

  const algo = { name: 'AES-GCM', iv };
  if (aad) algo.additionalData = typeof aad === 'string' ? te.encode(aad) : aad;

  try {
    const pt = await globalThis.crypto.subtle.decrypt(algo, key, ct);
    const text = td.decode(new Uint8Array(pt));
    if (typeof text !== 'string' || text.length === 0) throw new Error('Invalid plaintext');
    return { ok: true, plaintext: text };
  } catch (e) {
    return { ok: false, error: new Error('Decryption failed or integrity check failed') };
  }
}

// Backward-compatible simple CryptoJS wrappers (not used in AES-GCM path)
// Kept for reference and potential fallback
export const encryptMessage = async (message, bits) => {
  return encryptTextWithQuantumKey(message, bits);
};
export const decryptMessage = async (pkgOrB64, bits) => {
  return decryptTextWithQuantumKey(pkgOrB64, bits);
};

export default {
  randomBytes,
  toBase64,
  fromBase64,
  sanitizeBase64,
  assertKeyBits,
  bitsToBytes,
  importKeyMaterialFromBits,
  deriveAesGcmKeyFromBits,
  encryptTextWithQuantumKey,
  decryptTextWithQuantumKey,
  validateEncryptedPackage,
  parseEncryptedPackage,
};