import { NextResponse } from 'next/server';

/**
 * VaultSync API — Zero-Knowledge Architecture
 * 
 * All vault data is stored client-side in localStorage.
 * This API endpoint exists only to prevent 404 errors.
 * No user passwords or encrypted data ever passes through this server.
 */

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    message: 'VaultSyncc uses zero-knowledge client-side storage. Vault data is stored in your browser and never touches our servers.',
    architecture: 'client-side-only'
  });
}

export async function POST() {
  return NextResponse.json(
    { error: 'Vault data is managed client-side. No server storage available.' },
    { status: 410 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Vault data is managed client-side. No server storage available.' },
    { status: 410 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Vault data is managed client-side. No server storage available.' },
    { status: 410 }
  );
}
