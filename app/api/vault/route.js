import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getLocalVaultItems,
  saveLocalVaultItem,
  updateLocalVaultItem,
  deleteLocalVaultItem,
  saveLocalVaultVerifier,
  resetLocalVault
} from '../../../lib/storage/localVaultStorage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TEXT_LENGTH = 500;
const MAX_SECRET_LENGTH = 250_000;

function text(value, field, maxLength = MAX_TEXT_LENGTH, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) throw new Error(`${field} is required`);
    return '';
  }
  if (typeof value !== 'string') throw new Error(`${field} must be text`);
  const normalized = value.trim();
  if (required && !normalized) throw new Error(`${field} is required`);
  if (normalized.length > maxLength) throw new Error(`${field} is too long`);
  return normalized;
}

function optionalUrl(value) {
  const candidate = text(value, 'url', 300);
  if (!candidate) return '';
  try {
    const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
    const parsed = new URL(withProtocol);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return parsed.hostname.replace(/^www\./, '') || candidate;
    }
  } catch {
    return candidate.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, 100);
  }
  return '';
}

function vaultPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Request body must be an object');
  
  const rawCat = text(body.category, 'category') || 'Logins';
  const allowedCategories = ['Logins', 'Work', 'Entertainment', 'Productivity', 'Shopping', 'Finance', 'Other'];
  const matchedCat = allowedCategories.find((c) => c.toLowerCase() === rawCat.toLowerCase());
  const category = matchedCat || 'Other';

  const rawStrength = text(body.strength, 'strength') || 'Strong';
  const allowedStrengths = ['Strong', 'Moderate', 'Weak'];
  const matchedStrength = allowedStrengths.find((s) => s.toLowerCase() === rawStrength.toLowerCase());
  const strength = matchedStrength || 'Strong';

  const notesEncrypted = text(body.notes_encrypted, 'notes_encrypted', MAX_SECRET_LENGTH) || null;
  const notesIv = text(body.notes_iv, 'notes_iv', 128) || null;
  if (notesEncrypted && !notesIv) throw new Error('notes_iv is required for encrypted notes');

  return {
    name: text(body.name, 'name', 200, { required: true }),
    username: text(body.username, 'username', 200),
    encrypted_password: text(body.encrypted_password, 'encrypted_password', MAX_SECRET_LENGTH, { required: true }),
    iv: text(body.iv, 'iv', 128, { required: true }),
    notes_encrypted: notesEncrypted,
    notes_iv: notesIv,
    auth_tag: text(body.auth_tag, 'auth_tag', 32) || null,
    category,
    strength,
    icon_type: text(body.icon_type, 'icon_type', 200),
    url: optionalUrl(body.url),
  };
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vault = getLocalVaultItems(userId);

    return NextResponse.json({
      items: vault.items,
      hasMasterPassword: Boolean(vault.verifier || (vault.items && vault.items.length > 0)),
      verifier: vault.verifier,
      verifier_iv: vault.verifier_iv,
      source: 'vault_storage'
    });
  } catch (error) {
    console.error('Vault retrieval failed:', error);
    return NextResponse.json({ error: 'Unable to retrieve vault items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Verification token save
    if (body.is_verifier) {
      const verifier = text(body.verifier, 'verifier', 5000, { required: true });
      const verifierIv = text(body.verifier_iv, 'verifier_iv', 128, { required: true });
      saveLocalVaultVerifier(userId, verifier, verifierIv);
      return NextResponse.json({ success: true, message: 'Master key verifier saved' });
    }

    const payload = vaultPayload(body);
    const item = saveLocalVaultItem(userId, payload);
    return NextResponse.json({
      item,
      source: 'vault_storage'
    }, { status: 201 });
  } catch (error) {
    const status = error instanceof SyntaxError || /required|must be|too long|Invalid/.test(error?.message) ? 400 : 500;
    if (status === 500) console.error('Vault insert failed:', error);
    return NextResponse.json({ error: status === 400 ? error.message : 'Unable to save vault item' }, { status });
  }
}

export async function PUT(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const id = text(body.id, 'id', 128, { required: true });
    const payload = vaultPayload(body);

    const item = updateLocalVaultItem(userId, id, payload);
    return NextResponse.json({
      item,
      source: 'vault_storage'
    });
  } catch (error) {
    const status = error instanceof SyntaxError || /required|must be|too long|Invalid/.test(error?.message) ? 400 : 500;
    if (status === 500) console.error('Vault update failed:', error);
    return NextResponse.json({ error: status === 400 ? error.message : 'Unable to update vault item' }, { status });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Completely wipe and reset vault
    if (action === 'reset') {
      resetLocalVault(userId);
      return NextResponse.json({ success: true, message: 'Vault reset completely' });
    }

    const id = text(searchParams.get('id'), 'id', 128, { required: true });
    deleteLocalVaultItem(userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = /required|must be|too long|Invalid/.test(error?.message) ? 400 : 500;
    if (status === 500) console.error('Vault deletion failed:', error);
    return NextResponse.json({ error: status === 400 ? error.message : 'Unable to delete vault item' }, { status });
  }
}
