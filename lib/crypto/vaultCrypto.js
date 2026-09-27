/**
 * VaultSync / MyPass - Zero-Knowledge Client-Side Encryption
 * Standard Web Crypto API (SubtleCrypto)
 * - Key Derivation: PBKDF2 with SHA-256, 100,000 iterations
 * - Encryption: AES-256-GCM with 12-byte initialization vectors (IV)
 * 
 * Note: Passwords and vault secrets are ALWAYS encrypted in the browser BEFORE
 * sending to Supabase or network. Servers never see plaintext passwords.
 */

// Convert ArrayBuffer / Uint8Array to Base64
export function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window !== 'undefined' ? window.btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
}

// Convert Base64 to Uint8Array
export function base64ToBuffer(base64) {
  const binary = typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derive a 256-bit AES-GCM CryptoKey from a user's master password and salt.
 * @param {string} masterPassword - User's master password
 * @param {string} userEmail - Used as consistent salt seed if custom salt is not provided
 */
export async function deriveMasterKey(masterPassword, userEmail = 'vaultsync_default_salt') {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is only available in browser contexts');
  }

  const encoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Keep the original stable salt format for backwards-compatible vault unlocks.
  // A future migration can introduce a randomly generated per-vault salt without
  // locking users out of existing encrypted data.
  const salt = encoder.encode(`vaultsync_salt_${userEmail}`);

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {CryptoKey} key - Derived AES-GCM CryptoKey
 * @returns {Promise<{ ciphertext: string, iv: string }>}
 */
export async function encryptVaultSecret(plaintext, key) {
  if (!plaintext) return { ciphertext: '', iv: '' };
  if (!key) throw new Error('Encryption key is required');

  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV standard for GCM

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encoder.encode(plaintext)
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv)
  };
}

/**
 * Decrypt ciphertext using AES-256-GCM
 * @param {string} ciphertextBase64 - Base64 encoded encrypted data
 * @param {string} ivBase64 - Base64 encoded 12-byte IV
 * @param {CryptoKey} key - Derived AES-GCM CryptoKey
 * @returns {Promise<string>} Plaintext string
 */
export async function decryptVaultSecret(ciphertextBase64, ivBase64, key) {
  if (!ciphertextBase64 || !ivBase64) return '';
  if (!key) throw new Error('Decryption key is required');

  const decoder = new TextDecoder();
  const ciphertext = base64ToBuffer(ciphertextBase64);
  const iv = base64ToBuffer(ivBase64);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    ciphertext
  );

  return decoder.decode(decryptedBuffer);
}

/**
 * Export a CryptoKey to a Base64 string for secure session storage (scoped to active tab)
 * @param {CryptoKey} key
 * @returns {Promise<string|null>}
 */
export async function exportRawKey(key) {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle || !key) return null;
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return bufferToBase64(exported);
}

/**
 * Import a Base64-encoded raw key back into a CryptoKey
 * @param {string} base64Str
 * @returns {Promise<CryptoKey|null>}
 */
export async function importRawKey(base64Str) {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle || !base64Str) return null;
  const buffer = base64ToBuffer(base64Str);
  return await window.crypto.subtle.importKey(
    'raw',
    buffer,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Extract clean Base32 secret from raw string or otpauth:// URI
 * @param {string} str - e.g. "otpauth://totp/GitHub:user?secret=JBSWY3DPEHPK3PXP" or "JBSW Y3DP"
 * @returns {string} Clean Base32 secret
 */
export function extractTOTPSecret(str) {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (trimmed.toLowerCase().startsWith('otpauth://')) {
    try {
      const url = new URL(trimmed);
      const secret = url.searchParams.get('secret');
      if (secret) return secret.toUpperCase().replace(/[\s-]/g, '').replace(/=+$/, '');
    } catch {
      const match = trimmed.match(/[?&]secret=([A-Za-z2-7=]+)/i);
      if (match) return match[1].toUpperCase().replace(/[\s-]/g, '').replace(/=+$/, '');
    }
  }
  return trimmed.toUpperCase().replace(/[\s-]/g, '').replace(/=+$/, '');
}

/**
 * Decode RFC 4648 Base32 string into Uint8Array
 * @param {string} str - Base32 string or otpauth:// URI
 * @returns {Uint8Array}
 */
export function base32ToBuffer(str) {
  if (!str || typeof str !== 'string') return new Uint8Array(0);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = extractTOTPSecret(str);
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

/**
 * Validate whether a string is a valid Base32 2FA secret or otpauth:// URI
 * @param {string} str
 * @returns {boolean}
 */
export function isValidBase32(str) {
  if (!str || typeof str !== 'string') return false;
  const clean = extractTOTPSecret(str);
  return clean.length >= 8 && /^[A-Z2-7]+$/.test(clean);
}

/**
 * Generate RFC 6238 Time-based One-Time Password (TOTP)
 * @param {string} secretBase32 - 2FA Secret Key in Base32 format or otpauth:// URI
 * @param {number} timeStep - Time step in seconds (standard is 30)
 * @returns {Promise<{ code: string, timeRemaining: number }>}
 */
export async function generateTOTPCode(secretBase32, timeStep = 30) {
  if (!secretBase32) return { code: '------', timeRemaining: 30 };
  const cryptoObj = typeof window !== 'undefined' && window.crypto ? window.crypto : globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Crypto API not available');
  }

  const keyBytes = base32ToBuffer(secretBase32);
  if (keyBytes.length === 0) return { code: '------', timeRemaining: 30 };

  const key = await cryptoObj.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStep);

  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(counter), false);

  const signature = await cryptoObj.subtle.sign('HMAC', key, buffer);
  const hmac = new Uint8Array(signature);
  const offset = hmac[hmac.length - 1] & 0x0f;

  const codeInt =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const code = (codeInt % 1000000).toString().padStart(6, '0');
  const timeRemaining = timeStep - (epoch % timeStep);

  return { code, timeRemaining };
}


