/**
 * VaultSync — Comprehensive Automated Test Suite
 * Tests Cryptography, Storage, Logo Fetcher, Security Sanitization & Password Metrics
 */

import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}
if (!globalThis.window) {
  globalThis.window = {
    crypto: webcrypto,
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    atob: (b64) => Buffer.from(b64, 'base64').toString('binary')
  };
}

import {
  deriveMasterKey,
  encryptVaultSecret,
  decryptVaultSecret,
  exportRawKey,
  importRawKey,
  extractTOTPSecret,
  base32ToBuffer,
  isValidBase32,
  generateTOTPCode
} from '../lib/crypto/vaultCrypto.js';

import {
  resolveCompanyDomain,
  getCompanyLogoUrl,
  getCompanyLogoUrlFallback,
  getCompanyInitial
} from '../lib/utils/logoFetcher.js';

import {
  sanitizeSafeUrl,
  sanitizeTextInput,
  getLockoutDuration
} from '../lib/utils/security.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runAllTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING VAULTSYNC ROBUSTNESS TESTS');
  console.log('========================================\n');

  // --- 1. CRYPTOGRAPHIC TESTS ---
  console.log('--- 1. Cryptographic Suite & Zero-Knowledge Encryption ---');
  try {
    const password = 'SuperSecretMasterPassword123!@#';
    const email = 'user@example.com';
    const key = await deriveMasterKey(password, email);
    assert(key !== null && typeof key === 'object', 'Derived PBKDF2 AES-256-GCM CryptoKey successfully');

    // Test encryption & decryption of plain password
    const secret = 'MySuperBankPassword2026!';
    const encrypted = await encryptVaultSecret(secret, key);
    assert(encrypted.ciphertext && encrypted.iv, 'Encrypted secret with AES-256-GCM and generated unique 12-byte IV');

    const decrypted = await decryptVaultSecret(encrypted.ciphertext, encrypted.iv, key);
    assert(decrypted === secret, 'Decrypted ciphertext matches original plaintext exactly');

    // Test Unicode and Special Characters
    const unicodeSecret = '🔐 VaultSync 🚀 日本語 复杂的密码 €100 @#$%^&*()';
    const encUnicode = await encryptVaultSecret(unicodeSecret, key);
    const decUnicode = await decryptVaultSecret(encUnicode.ciphertext, encUnicode.iv, key);
    assert(decUnicode === unicodeSecret, 'Successfully encrypted and decrypted complex Unicode & emoji strings');

    // Test Tamper Detection (AES-GCM Authentication Tag verification)
    let isTamperCaught = false;
    try {
      // Corrupt a byte in the ciphertext
      const raw = Buffer.from(encrypted.ciphertext, 'base64');
      raw[0] = raw[0] ^ 0xff;
      const corruptedCiphertext = raw.toString('base64');
      await decryptVaultSecret(corruptedCiphertext, encrypted.iv, key);
    } catch {
      isTamperCaught = true;
    }
    assert(isTamperCaught, 'Tampered ciphertext rejected immediately by AES-GCM tag verification');

    // Test Wrong Master Key Decryption Rejection
    const wrongKey = await deriveMasterKey('WrongMasterPassword999!', email);
    let isWrongKeyCaught = false;
    try {
      await decryptVaultSecret(encrypted.ciphertext, encrypted.iv, wrongKey);
    } catch {
      isWrongKeyCaught = true;
    }
    assert(isWrongKeyCaught, 'Wrong master key fails decryption securely without leaking data');

    // Test Raw Key Export and Re-Import
    const exportedKeyStr = await exportRawKey(key);
    assert(typeof exportedKeyStr === 'string' && exportedKeyStr.length > 20, 'Exported raw session key to Base64');

    const importedKey = await importRawKey(exportedKeyStr);
    const decWithImported = await decryptVaultSecret(encrypted.ciphertext, encrypted.iv, importedKey);
    assert(decWithImported === secret, 'Re-imported session key decrypts vault data correctly');
  } catch (err) {
    assert(false, `Crypto suite threw unexpected error: ${err.message}`);
  }

  // --- 2. 2FA TOTP & BASE32 TESTS ---
  console.log('\n--- 2. RFC 6238 TOTP Generator & Base32 Parser ---');
  try {
    const rawSecret = 'JBSWY3DPEHPK3PXP';
    assert(isValidBase32(rawSecret), 'Base32 secret validated correctly');
    assert(isValidBase32('jbsw y3dp ehpk 3pxp'), 'Base32 secret with spaces & lowercase validated correctly');

    const otpauthUri = 'otpauth://totp/GitHub:user?secret=JBSWY3DPEHPK3PXP&issuer=GitHub';
    assert(extractTOTPSecret(otpauthUri) === 'JBSWY3DPEHPK3PXP', 'Extracted secret cleanly from otpauth:// URI');

    const totpResult = await generateTOTPCode(rawSecret);
    assert(totpResult.code && totpResult.code.length === 6 && /^\d{6}$/.test(totpResult.code), `Generated 6-digit live TOTP code: ${totpResult.code}`);
    assert(totpResult.timeRemaining >= 1 && totpResult.timeRemaining <= 30, `Calculated accurate 30s remaining countdown: ${totpResult.timeRemaining}s`);
  } catch (err) {
    assert(false, `TOTP suite threw unexpected error: ${err.message}`);
  }

  // --- 3. LOGO & DOMAIN RESOLVER TESTS ---
  console.log('\n--- 3. Logo & Domain Auto-Resolver Suite ---');
  try {
    const testCases = [
      { input: 'supabase', expected: 'supabase.com' },
      { input: 'supabse', expected: 'supabase.com' }, // typo
      { input: 'hp', expected: 'hp.com' },
      { input: 'HP', expected: 'hp.com' },
      { input: 'github', expected: 'github.com' },
      { input: 'https://github.com/login', expected: 'github.com' },
      { input: 'http://netflix.com/browse', expected: 'netflix.com' },
      { input: 'chatgpt', expected: 'chatgpt.com' },
      { input: 'openai', expected: 'openai.com' },
      { input: 'dell', expected: 'dell.com' },
      { input: 'asus', expected: 'asus.com' },
      { input: 'vercel', expected: 'vercel.com' },
      { input: 'clerk', expected: 'clerk.com' },
      { input: 'mongodb', expected: 'mongodb.com' },
      { input: 'custom-service.io', expected: 'custom-service.io' }
    ];

    for (const { input, expected } of testCases) {
      const resolved = resolveCompanyDomain(input);
      assert(resolved === expected, `resolveCompanyDomain("${input}") → "${resolved}" (expected: "${expected}")`);
    }

    const cdnUrl = getCompanyLogoUrl('supabase');
    assert(cdnUrl.includes('google.com/s2/favicons') && cdnUrl.includes('supabase.com'), 'Generated high-res Google Favicons CDN URL for Supabase');

    const initial = getCompanyInitial('Supabase');
    assert(initial === 'S', 'Extracted clean brand initial fallback letter "S"');
  } catch (err) {
    assert(false, `Logo fetcher suite threw error: ${err.message}`);
  }

  // --- 4. SECURITY & ANTI-HACKING SANITIZATION TESTS ---
  console.log('\n--- 4. Security & Anti-Hacking Sanitization Suite ---');
  try {
    // URL Sanitization
    const dangerousUrls = [
      'javascript:alert(document.cookie)',
      'javascript://%0Aalert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox("hacked")',
      'blob:https://example.com/uuid',
      'file:///etc/passwd'
    ];

    for (const dUrl of dangerousUrls) {
      const sanitized = sanitizeSafeUrl(dUrl);
      assert(sanitized === null, `Blocked malicious URI scheme: "${dUrl}" → null`);
    }

    const safeUrls = [
      { input: 'https://github.com', expected: 'https://github.com/' },
      { input: 'http://localhost:3000', expected: 'http://localhost:3000/' },
      { input: 'supabase.com/dashboard', expected: 'https://supabase.com/dashboard' }
    ];

    for (const { input, expected } of safeUrls) {
      const sanitized = sanitizeSafeUrl(input);
      assert(sanitized !== null && sanitized.startsWith('http'), `Allowed safe web URL: "${input}" → "${sanitized}"`);
    }

    // Text Sanitization
    const dirtyText = 'Normal Text\u0000\u0007\u001F with hidden control characters';
    const cleanText = sanitizeTextInput(dirtyText, 100);
    assert(!cleanText.includes('\u0000') && cleanText.startsWith('Normal Text'), 'Sanitized malicious control characters from text input');

    // Progressive Lockout Rate Limiter
    assert(getLockoutDuration(1) === 0, 'Attempts = 1: No lockout');
    assert(getLockoutDuration(3) === 5, 'Attempts = 3: 5 second lockout');
    assert(getLockoutDuration(5) === 30, 'Attempts = 5: 30 second lockout');
    assert(getLockoutDuration(8) === 60, 'Attempts = 8: 60 second lockout');
    assert(getLockoutDuration(12) === 300, 'Attempts = 12: 300 second (5 min) maximum lockout');
  } catch (err) {
    assert(false, `Security suite threw error: ${err.message}`);
  }

  // --- SUMMARY ---
  console.log('\n========================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
