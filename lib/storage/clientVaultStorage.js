/**
 * VaultSync — Pure Client-Side Vault Storage
 * 
 * All encrypted vault data is stored exclusively in the user's browser
 * using localStorage. No password data ever touches VaultSync servers.
 * 
 * Storage is keyed by Clerk userId to isolate vaults per user identity.
 * All values stored are already AES-256-GCM encrypted ciphertext — 
 * localStorage contains zero plaintext credentials.
 */

const VAULT_PREFIX = 'vaultsync_vault_';

function getStorageKey(userId) {
  return VAULT_PREFIX + (userId || 'anonymous');
}

function readVault(userId) {
  if (typeof window === 'undefined') {
    return { items: [], verifier: null, verifier_iv: null, updated_at: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) {
      return { items: [], verifier: null, verifier_iv: null, updated_at: new Date().toISOString() };
    }
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      verifier: parsed.verifier || null,
      verifier_iv: parsed.verifier_iv || null,
      updated_at: parsed.updated_at || new Date().toISOString()
    };
  } catch (err) {
    console.error('Failed to read vault from localStorage:', err);
    return { items: [], verifier: null, verifier_iv: null, updated_at: new Date().toISOString() };
  }
}

function writeVault(userId, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
  } catch (err) {
    console.error('Failed to write vault to localStorage:', err);
  }
}

/**
 * Get all vault items and verifier for a user.
 * Returns: { items, verifier, verifier_iv, hasMasterPassword }
 */
export function getVaultData(userId) {
  const vault = readVault(userId);
  return {
    items: vault.items,
    verifier: vault.verifier,
    verifier_iv: vault.verifier_iv,
    hasMasterPassword: Boolean(vault.verifier || (vault.items && vault.items.length > 0)),
    source: 'client_storage'
  };
}

/**
 * Save the master password verifier (encrypted canary).
 */
export function saveVerifier(userId, verifier, verifier_iv) {
  const vault = readVault(userId);
  vault.verifier = verifier;
  vault.verifier_iv = verifier_iv;
  vault.updated_at = new Date().toISOString();
  writeVault(userId, vault);
  return true;
}

/**
 * Add a new encrypted item to the vault.
 * Returns the created item with generated id and timestamps.
 */
export function addVaultItem(userId, item) {
  const vault = readVault(userId);
  const now = new Date().toISOString();
  const newItem = {
    id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    created_at: now,
    updated_at: now,
    ...item
  };
  vault.items = [newItem, ...vault.items];
  vault.updated_at = now;
  writeVault(userId, vault);
  return newItem;
}

/**
 * Update an existing vault item by id.
 * Returns the updated item.
 */
export function updateVaultItem(userId, id, updates) {
  const vault = readVault(userId);
  const now = new Date().toISOString();
  let updatedItem = null;

  vault.items = vault.items.map((it) => {
    if (it.id === id) {
      updatedItem = { ...it, ...updates, updated_at: now };
      return updatedItem;
    }
    return it;
  });

  if (!updatedItem) {
    // Item not found — insert as new
    updatedItem = { id, user_id: userId, created_at: now, updated_at: now, ...updates };
    vault.items = [updatedItem, ...vault.items];
  }

  vault.updated_at = now;
  writeVault(userId, vault);
  return updatedItem;
}

/**
 * Delete a vault item by id.
 */
export function deleteVaultItem(userId, id) {
  const vault = readVault(userId);
  vault.items = vault.items.filter((it) => it.id !== id);
  vault.updated_at = new Date().toISOString();
  writeVault(userId, vault);
  return true;
}

/**
 * Completely reset (wipe) a user's vault.
 */
export function resetVault(userId) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getStorageKey(userId));
  } catch (err) {
    console.warn('Failed to reset vault:', err);
  }
  return true;
}

/**
 * Export the entire vault as a JSON string (for backup).
 */
export function exportVaultBackup(userId) {
  const vault = readVault(userId);
  return JSON.stringify(vault, null, 2);
}

/**
 * Import a vault backup from a JSON string.
 * Merges items by id (existing items are overwritten, new items are appended).
 */
export function importVaultBackup(userId, jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    if (!imported || !Array.isArray(imported.items)) {
      throw new Error('Invalid vault backup format');
    }
    const vault = readVault(userId);
    const existingIds = new Set(vault.items.map((it) => it.id));
    
    for (const item of imported.items) {
      if (existingIds.has(item.id)) {
        vault.items = vault.items.map((it) => it.id === item.id ? { ...it, ...item } : it);
      } else {
        vault.items.push(item);
      }
    }

    if (imported.verifier && !vault.verifier) {
      vault.verifier = imported.verifier;
      vault.verifier_iv = imported.verifier_iv;
    }

    vault.updated_at = new Date().toISOString();
    writeVault(userId, vault);
    return { success: true, count: imported.items.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
