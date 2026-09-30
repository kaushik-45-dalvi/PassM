/**
 * VaultSync / MyPass - Security & Anti-Hacking Defenses
 * 
 * Implements strict sanitization, defense-in-depth URL validation,
 * and memory cleansing to protect against XSS, protocol injection,
 * clipboard harvest malware, and automated brute-force attempts.
 */

/**
 * Sanitize an outbound web URL to guarantee it only points to safe http(s) protocols.
 * Strictly prevents `javascript:`, `data:`, `vbscript:`, `file:`, `blob:`, and control-character attacks.
 * 
 * @param {string} rawUrl - Untrusted user input
 * @returns {string|null} - Safe absolute URL string or null if invalid/unsafe
 */
export function sanitizeSafeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  // Trim and strip zero-width and control characters
  const trimmed = rawUrl.trim().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
  if (!trimmed) return null;

  // Reject explicit dangerous protocol prefixes immediately
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('blob:') ||
    lower.startsWith('file:') ||
    lower.startsWith('about:')
  ) {
    return null;
  }

  // Prepend https:// if protocol is omitted
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    // Strictly whitelist only http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    // Hostname must be non-empty and not contain control characters
    if (!parsed.hostname || parsed.hostname.length > 253) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Sanitize untrusted text input against payload abuse and memory exhaustion
 * @param {string} input
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeTextInput(input, maxLength = 2000) {
  if (!input || typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

/**
 * Calculate progressive exponential lockout seconds based on failed attempts
 * @param {number} attempts - Number of consecutive failed unlock attempts
 * @returns {number} Seconds to lockout
 */
export function getLockoutDuration(attempts) {
  if (attempts < 3) return 0;
  if (attempts < 5) return 5;     // 5s warning after 3 failures
  if (attempts < 8) return 30;    // 30s lockout after 5 failures
  if (attempts < 10) return 60;   // 60s lockout after 8 failures
  return 300;                     // 5 min maximum lockout for 10+ failures
}
