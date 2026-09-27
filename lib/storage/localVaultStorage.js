import fs from 'fs';
import path from 'path';
import os from 'os';

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
const DATA_DIR = IS_SERVERLESS 
  ? path.join(os.tmpdir(), 'vaultsync_vaults')
  : path.join(process.cwd(), 'data', 'vaults');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn('ensureDataDir notice:', e.message);
  }
}

function sanitizeUserId(userId) {
  return String(userId || 'default').replace(/[^a-zA-Z0-9_-]/g, '_');
}

function getUserFilePath(userId) {
  ensureDataDir();
  const safeId = sanitizeUserId(userId);
  return path.join(DATA_DIR, `${safeId}.json`);
}

function readUserData(userId) {
  const filePath = getUserFilePath(userId);
  if (!fs.existsSync(filePath)) {
    return { items: [], verifier: null, verifier_iv: null, updated_at: new Date().toISOString() };
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      verifier: parsed.verifier || null,
      verifier_iv: parsed.verifier_iv || null,
      updated_at: parsed.updated_at || new Date().toISOString()
    };
  } catch (err) {
    console.error('Failed to parse user vault file:', err);
    return { items: [], verifier: null, verifier_iv: null, updated_at: new Date().toISOString() };
  }
}

function writeUserData(userId, data) {
  try {
    const filePath = getUserFilePath(userId);
    const payload = JSON.stringify(data, null, 2);
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    try {
      fs.writeFileSync(tempPath, payload, 'utf8');
      try {
        fs.renameSync(tempPath, filePath);
      } catch {
        // Fallback for Windows EPERM / filesystem locking
        fs.copyFileSync(tempPath, filePath);
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }
    } catch {
      // Direct write fallback
      fs.writeFileSync(filePath, payload, 'utf8');
    }
  } catch (err) {
    console.error('Failed to write user vault file:', err);
  }
}

export function getLocalVaultItems(userId) {
  const data = readUserData(userId);
  return {
    items: data.items,
    verifier: data.verifier,
    verifier_iv: data.verifier_iv
  };
}

export function saveLocalVaultItem(userId, item) {
  const data = readUserData(userId);
  const now = new Date().toISOString();
  const newItem = {
    id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    created_at: now,
    updated_at: now,
    ...item
  };
  // Prepend new item
  data.items = [newItem, ...data.items];
  data.updated_at = now;
  writeUserData(userId, data);
  return newItem;
}

export function updateLocalVaultItem(userId, id, updates) {
  const data = readUserData(userId);
  const now = new Date().toISOString();
  let found = false;
  let updatedItem = null;

  data.items = data.items.map((it) => {
    if (it.id === id) {
      found = true;
      updatedItem = { ...it, ...updates, updated_at: now };
      return updatedItem;
    }
    return it;
  });

  if (!found) {
    updatedItem = {
      id,
      user_id: userId,
      created_at: now,
      updated_at: now,
      ...updates
    };
    data.items = [updatedItem, ...data.items];
  }

  data.updated_at = now;
  writeUserData(userId, data);
  return updatedItem;
}

export function deleteLocalVaultItem(userId, id) {
  const data = readUserData(userId);
  data.items = data.items.filter((it) => it.id !== id);
  data.updated_at = new Date().toISOString();
  writeUserData(userId, data);
  return true;
}

export function saveLocalVaultVerifier(userId, verifier, verifier_iv) {
  const data = readUserData(userId);
  data.verifier = verifier;
  data.verifier_iv = verifier_iv;
  data.updated_at = new Date().toISOString();
  writeUserData(userId, data);
  return true;
}

export function resetLocalVault(userId) {
  const filePath = getUserFilePath(userId);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn('Failed to delete user vault file, rewriting empty:', err);
      writeUserData(userId, { items: [], verifier: null, verifier_iv: null, updated_at: new Date().toISOString() });
    }
  }
  return true;
}

