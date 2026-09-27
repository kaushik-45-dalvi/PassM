import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseAdminClient } from '../../../lib/supabase/admin';
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

function normalizeUserId(userId) {
  if (!userId) return null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return userId;
  }
  const hash = crypto.createHash('sha1').update(userId).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '5' + hash.substring(13, 16),
    ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16) + hash.substring(18, 20),
    hash.substring(20, 32)
  ].join('-');
}

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
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseUserId = normalizeUserId(userId);
    const database = createSupabaseAdminClient();
    const local = getLocalVaultItems(userId);

    if (database) {
      try {
        const { data, error } = await database
          .from('vault_items')
          .select('*')
          .eq('user_id', supabaseUserId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const verifierRow = data.find((r) => r.name === '__vaultsync_verifier__');
          const cleanItems = data.filter((r) => r.name !== '__vaultsync_verifier__');

          // If Supabase is connected but empty, and local storage has items: auto-sync local items to cloud!
          if (cleanItems.length === 0 && !verifierRow && (local.items.length > 0 || local.verifier)) {
            try {
              if (local.verifier) {
                await database.from('vault_items').upsert({
                  name: '__vaultsync_verifier__',
                  encrypted_password: local.verifier,
                  iv: local.verifier_iv,
                  user_id: supabaseUserId,
                  category: 'Other',
                  strength: 'Strong'
                });
              }
              for (const it of local.items) {
                await database.from('vault_items').upsert({
                  id: it.id,
                  name: it.name,
                  username: it.username,
                  encrypted_password: it.encrypted_password,
                  iv: it.iv,
                  notes_encrypted: it.notes_encrypted || null,
                  notes_iv: it.notes_iv || null,
                  auth_tag: it.auth_tag || null,
                  category: it.category || 'Logins',
                  strength: it.strength || 'Strong',
                  icon_type: it.icon_type || it.url,
                  url: it.url,
                  user_id: supabaseUserId
                });
              }
              return NextResponse.json({
                items: local.items,
                hasMasterPassword: Boolean(local.verifier || local.items.length > 0),
                verifier: local.verifier,
                verifier_iv: local.verifier_iv,
                source: 'secure_cloud'
              });
            } catch (syncErr) {
              console.warn('Auto-sync from local to cloud error:', syncErr);
            }
          }

          // If cloud has items, also mirror to local storage for offline capability
          if (cleanItems.length > 0 || verifierRow) {
            try {
              if (verifierRow) {
                saveLocalVaultVerifier(userId, verifierRow.encrypted_password, verifierRow.iv);
              }
              for (const cloudItem of cleanItems) {
                updateLocalVaultItem(userId, cloudItem.id, cloudItem);
              }
            } catch (mirrorErr) {
              console.warn('Local disk mirror failed:', mirrorErr);
            }
          }

          return NextResponse.json({
            items: cleanItems,
            hasMasterPassword: Boolean(verifierRow || cleanItems.length > 0),
            verifier: verifierRow?.encrypted_password || null,
            verifier_iv: verifierRow?.iv || null,
            source: 'secure_cloud'
          });
        }
      } catch (dbErr) {
        console.warn('Supabase query failed, falling back to local vault store:', dbErr.message);
      }
    }

    // Local persistent storage fallback
    return NextResponse.json({
      items: local.items,
      hasMasterPassword: Boolean(local.verifier || local.items.length > 0),
      verifier: local.verifier,
      verifier_iv: local.verifier_iv,
      source: 'secure_storage'
    });
  } catch (error) {
    console.error('Vault retrieval failed', error);
    return NextResponse.json({ error: 'Unable to retrieve vault items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseUserId = normalizeUserId(userId);
    const body = await request.json();

    // Verification token save
    if (body.is_verifier) {
      const verifier = text(body.verifier, 'verifier', 5000, { required: true });
      const verifierIv = text(body.verifier_iv, 'verifier_iv', 128, { required: true });
      const database = createSupabaseAdminClient();
      if (database) {
        try {
          await database.from('vault_items').upsert({
            name: '__vaultsync_verifier__',
            encrypted_password: verifier,
            iv: verifierIv,
            user_id: supabaseUserId,
            category: 'Other',
            strength: 'Strong'
          });
        } catch (dbErr) {
          console.warn('Supabase verifier save failed, fallback to local:', dbErr.message);
        }
      }
      saveLocalVaultVerifier(userId, verifier, verifierIv);
      return NextResponse.json({ success: true, message: 'Master key verifier saved' });
    }

    const payload = vaultPayload(body);
    const database = createSupabaseAdminClient();
    let cloudItem = null;
    if (database) {
      try {
        const { data, error } = await database
          .from('vault_items')
          .insert({ ...payload, user_id: supabaseUserId })
          .select()
          .single();
        if (!error && data) {
          cloudItem = data;
        }
      } catch (dbErr) {
        console.warn('Supabase insert failed, falling back to local store:', dbErr.message);
      }
    }

    const localItem = saveLocalVaultItem(userId, cloudItem || payload);
    return NextResponse.json({
      item: cloudItem || localItem,
      source: cloudItem ? 'secure_cloud' : 'secure_storage'
    }, { status: 201 });
  } catch (error) {
    const status = error instanceof SyntaxError || /required|must be|too long|Invalid/.test(error.message) ? 400 : 500;
    if (status === 500) console.error('Vault insert failed', error);
    return NextResponse.json({ error: status === 400 ? error.message : 'Unable to save vault item' }, { status });
  }
}

export async function PUT(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseUserId = normalizeUserId(userId);
    const body = await request.json();
    const id = text(body.id, 'id', 128, { required: true });
    const payload = vaultPayload(body);

    const database = createSupabaseAdminClient();
    let cloudItem = null;
    if (database) {
      try {
        const { data, error } = await database
          .from('vault_items')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', supabaseUserId)
          .select()
          .single();
        if (!error && data) {
          cloudItem = data;
        }
      } catch (dbErr) {
        console.warn('Supabase update failed, falling back to local store:', dbErr.message);
      }
    }

    const localItem = updateLocalVaultItem(userId, id, cloudItem || payload);
    return NextResponse.json({
      item: cloudItem || localItem,
      source: cloudItem ? 'secure_cloud' : 'secure_storage'
    });
  } catch (error) {
    const status = error instanceof SyntaxError || /required|must be|too long|Invalid/.test(error.message) ? 400 : 500;
    if (status === 500) console.error('Vault update failed', error);
    return NextResponse.json({ error: status === 400 ? error.message : 'Unable to update vault item' }, { status });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseUserId = normalizeUserId(userId);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Completely wipe and reset vault
    if (action === 'reset') {
      const database = createSupabaseAdminClient();
      if (database) {
        try {
          await database.from('vault_items').delete().eq('user_id', supabaseUserId);
        } catch (dbErr) {
          console.warn('Supabase reset failed, continuing with local store:', dbErr.message);
        }
      }
      resetLocalVault(userId);
      return NextResponse.json({ success: true, message: 'Vault reset completely' });
    }

    const id = text(searchParams.get('id'), 'id', 128, { required: true });
    const database = createSupabaseAdminClient();
    if (database) {
      try {
        await database
          .from('vault_items')
          .delete()
          .eq('id', id)
          .eq('user_id', supabaseUserId);
      } catch (dbErr) {
        console.warn('Supabase delete failed, falling back to local store:', dbErr.message);
      }
    }

    deleteLocalVaultItem(userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = /required|must be|too long|Invalid/.test(error.message) ? 400 : 500;
    if (status === 500) console.error('Vault deletion failed', error);
    return NextResponse.json({ error: status === 400 ? error.message : 'Unable to delete vault item' }, { status });
  }
}
