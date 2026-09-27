<USER_REQUEST>
i want to make a project for which im attching the srs and the ui/ux design look th e image i attched i want same design for y website no change only chnage the content according to the srs -----# VaultSync: P2P Password Manager
## Complete SRS + Security Architecture

**Version:** 1.0  
**Status:** Ready to Build  
**Build Time:** 4-6 weeks (MVP)  
**Timeline to Revenue:** 8 weeks  

---

## 📋 TABLE OF CONTENTS

1. Executive Summary
2. Product Overview
3. Core Features (MVP)
4. Security Architecture
5. Technical Specifications
6. Data Flow & Architecture
7. User Flows
8. Mobile Specifications
9. Desktop Specifications
10. Threat Modeling & Countermeasures
11. Compliance & Privacy
12. Build Roadmap

---

## 1️⃣ EXECUTIVE SUMMARY

**Product:** VaultSync - P2P Password Manager  
**Tagline:** "Your passwords. Your devices. No server. Ever."  
**Core Promise:** Store passwords on your devices only. Sync across devices using P2P. Nobody (including us) can access.

**Why it exists:**
- 1Password, LastPass, Bitwarden store passwords on centralized servers
- If hacked, all passwords compromised
- Users distrust centralized password managers
- $3-5/month is expensive for what you get

**What makes it different:**
- ✅ No central server (passwords never leave your devices)
- ✅ P2P sync using WebRTC + encryption
- ✅ Even we can't access your passwords (zero-knowledge)
- ✅ Offline-first (works without internet)
- ✅ Free personal use, paid for team/sharing
- ✅ Private by architecture, not by promise

**Market Opportunity:**
- 100M people use password managers
- $3-5B market annually
- 1% adoption = $30M+ ARR

**Revenue Model:**
- Free: Personal use (single device)
- $0.99/month: Multi-device sync
- $3/month: Team sharing (encrypted)
- $10/month: Business features (admin panel)
- $50/month: Enterprise white-label

---

## 2️⃣ PRODUCT OVERVIEW

### 2.1 Vision
Make password management actually private. Store passwords only on your devices. Sync securely between devices. No company (including us) can see your data.

### 2.2 Core Principle
**Zero-Knowledge Architecture:** We know nothing about your passwords or data. Not because we choose not to look, but because the system is designed so we literally can't.

### 2.3 Competitive Advantage

| Feature | 1Password | LastPass | Bitwarden | VaultSync |
|---------|-----------|----------|-----------|-----------|
| Cloud-based | ✅ | ✅ | ✅ | ❌ |
| Zero-knowledge | ❌ | ❌ | ✅ | ✅ |
| P2P sync | ❌ | ❌ | ❌ | ✅ |
| Works offline | ❌ | ❌ | ❌ | ✅ |
| Price/month | $3-5 | $3-5 | $10 | $0.99-3 |
| Open source | ❌ | ❌ | ✅ | ✅ |
| No account required | ❌ | ❌ | ❌ | ✅ (personal) |

### 2.4 Target Users

**Primary:** Tech-savvy individuals (developers, engineers, privacy-conscious users)  
**Secondary:** Teams & small businesses  
**Tertiary:** Enterprise (white-label)

**User Persona 1: Alex (Developer)**
- Uses multiple devices (laptop, phone, tablet)
- Paranoid about data privacy
- Doesn't trust cloud storage
- Willing to pay $1-3/month for peace of mind
- Values "works offline"

**User Persona 2: Sarah (Small Business Owner)**
- Manages team passwords (5-10 people)
- Needs to share passwords securely
- Doesn't want monthly audit trails
- Wants to control data (not in someone else's cloud)
- Willing to pay $3-10/month

---

## 3️⃣ CORE FEATURES (MVP)

### Phase 1: Personal Use (Weeks 1-2)

**Core Vault Features:**
- ✅ Create master password (never stored, only hashed locally)
- ✅ Add password entries (website, username, password, notes)
- ✅ View/copy passwords
- ✅ Edit/delete entries
- ✅ Search passwords
- ✅ Organize with tags/folders
- ✅ Auto-lock after 5 min inactivity
- ✅ Local encryption at rest (SQLite encrypted)

**Device Features:**
- ✅ Biometric unlock (fingerprint, face ID)
- ✅ Master password reset (with recovery code)
- ✅ Export vault (encrypted backup)
- ✅ Import vault (from other managers)

**Platforms:**
- iOS app (React Native)
- Android app (React Native)
- macOS app (Electron)
- Windows app (Electron)
- Web app (progressive, works offline)

---

### Phase 2: Multi-Device Sync (Weeks 3-4)

**Sync Architecture:**
- ✅ P2P sync between devices using WebRTC
- ✅ Encrypted end-to-end (only your devices can decrypt)
- ✅ Works across WiFi & mobile data
- ✅ Works internationally
- ✅ Conflict resolution (if both devices edit same password)
- ✅ Sync history (see what changed)

**Sync Setup:**
- Generate sync code on Device A (6-character code)
- Enter sync code on Device B
- WebRTC connection established
- Passwords synced (encrypted)
- Devices now stay synced automatically

**Recurring Sync:**
- Background sync every 5 minutes (when online)
- Manual sync on-demand
- Sync status indicator (✅ synced, ⏳ syncing, ❌ offline)

---

### Phase 3: Team Sharing (Weeks 5-6)

**Team Features:**
- ✅ Create teams (name, members)
- ✅ Add members (by email or invite link)
- ✅ Shared vaults (team passwords)
- ✅ Shared vault encryption (team key)
- ✅ Audit log (who accessed what, when)
- ✅ Remove members (revoke access instantly)
- ✅ Password expiration (auto-notify team to change)

**Encryption for Teams:**
- Each team vault has team encryption key
- Team key encrypted with each member's public key
- When member added: their public key receives encrypted team key
- When member removed: team key rotated, all members get new key
- Removed member loses access (old key doesn't work)

---

## 4️⃣ SECURITY ARCHITECTURE

### 🔐 4.1 ENCRYPTION STRATEGY

#### **Layer 1: At-Rest Encryption (Passwords stored locally)**

**Database:** SQLite with SQLCipher  
**Encryption:** AES-256-GCM  
**Key Derivation:** PBKDF2 (100,000 iterations)

```
Master Password
     ↓
PBKDF2 (100k iterations, SHA-256)
     ↓
Encryption Key (256-bit)
     ↓
AES-256-GCM encrypts SQLite database
     ↓
Encrypted database stored locally
```

**Implementation:**
```javascript
// Master password → encryption key
const key = crypto.pbkdf2Sync(
  masterPassword,
  salt, // 32-byte random salt
  100000, // iterations
  32, // 256 bits
  'sha256'
);

// Encrypt vault data
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encrypted = cipher.update(vaultData);
encrypted += cipher.final();
const authTag = cipher.getAuthTag();

// Store: [salt | iv | authTag | encrypted data]
```

---

#### **Layer 2: In-Transit Encryption (P2P Sync)**

**Protocol:** DTLS 1.2 (Datagram TLS)  
**Cipher Suite:** TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384  
**Key Exchange:** ECDH (Elliptic Curve Diffie-Hellman)

**Why DTLS (not TLS)?**
- TLS requires persistent connection (not ideal for mobile)
- DTLS works over UDP (faster, more reliable for unstable networks)
- Same security as TLS but optimized for WebRTC

```
Device A                          Device B
    ↓                                ↓
  Master Password                Master Password
    ↓                                ↓
  Encryption Key A              Encryption Key B
    ↓                                ↓
[Device A vault encrypted]   [Device B vault encrypted]
    ↓                                ↓
  DTLS Handshake ←→ DTLS Handshake
    ↓                                ↓
Encrypted sync data flows through DTLS tunnel
    ↓                                ↓
Device A decrypts with its Key  Device B decrypts with its Key
    ↓                                ↓
Both have same passwords synced (end-to-end encrypted)
```

**WebRTC Implementation:**
```javascript
// Initialize DTLS connection
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, // STUN
    { urls: 'turn:turn.example.com', username: '', credential: '' } // TURN
  ]
});

// Create encrypted data channel
const dataChannel = peerConnection.createDataChannel('sync', {
  ordered: true
});

dataChannel.onopen = () => {
  // Send encrypted vault data
  const encrypted = encryptVault(masterPassword, vaultData);
  dataChannel.send(encrypted);
};

dataChannel.onmessage = (event) => {
  // Receive encrypted data from peer
  const decrypted = decryptVault(masterPassword, event.data);
  updateLocalVault(decrypted);
};
```

**TURN Relay Security:**
- TURN server is encrypted (DTLS)
- TURN server cannot read data (encrypted end-to-end)
- TURN server only relays encrypted packets
- No way for TURN to access passwords

---

#### **Layer 3: Password Entry Encryption (Individual entries)**

Each password entry gets its own encryption:

```
Password Entry:
{
  id: "uuid",
  website: "github.com",
  username: "kaushik@example.com",
  password: "super_secret_123",
  notes: "personal account"
}
         ↓
HMAC-SHA256 (integrity check)
         ↓
AES-256-GCM (encryption)
         ↓
Stored in encrypted database
```

This provides:
- ✅ Integrity verification (HMAC prevents tampering)
- ✅ Confidentiality (AES-256)
- ✅ Authenticity (proves only you encrypted it)

---

#### **Layer 4: Team Vault Encryption**

When sharing passwords with team:

```
Team Vault Data
        ↓
AES-256-GCM (encrypt with team key)
        ↓
Team key encrypted with each member's public key
        ↓
Each member can decrypt team key with their private key
        ↓
Member decrypts vault data
```

**Process:**
```
1. Create team vault
2. Generate team encryption key (256-bit random)
3. For each team member:
   - Get their public key
   - Encrypt team key with their public key
   - Member stores: [team_key_encrypted_with_their_pk]
4. Team vault encrypted with team key
5. Member decrypts: 
   - Decrypt team key using their private key
   - Decrypt team vault using team key

When member removed:
1. Generate new team key
2. Re-encrypt team vault with new key
3. Encrypt new key for remaining members
4. Old member's private key doesn't have new key → no access
```

---

### 🔑 4.2 KEY MANAGEMENT

**Master Password:**
- Never stored (not even as hash)
- User enters it every session
- Used to derive encryption key
- If forgotten → recovery code only option

**Encryption Keys:**
- Generated on device (never transmitted)
- Derived from master password using PBKDF2
- Stored in device secure enclave (iOS) / Keystore (Android)
- Cleared from memory after use

**Sync Codes:**
- 6-character alphanumeric (supports 36^6 = 2.1 billion combinations)
- Used only once to establish P2P connection
- Not stored after sync complete
- Expires after 5 minutes if not used

**Recovery Codes:**
- 10 backup codes (12 characters each)
- Generated on first app launch
- User stores offline (printed or in secure location)
- Can reset master password if forgotten
- Each code works once

**Team Keys:**
- Generated randomly on creator's device
- Encrypted separately for each member (with their public key)
- When member removed → key rotated
- Old key destroyed from member's device

---

### 🛡️ 4.3 AUTHENTICATION

#### **Local Authentication (Unlocking Vault)**

**Primary:**
- Master password (required)
- Must type full password (no hint visible)
- Minimum 12 characters required
- Case-sensitive

**Secondary (Biometric):**
- Fingerprint (iOS Touch ID, Android Biometric)
- Face recognition (iOS Face ID, Windows Hello, Android Face Unlock)
- Falls back to password if biometric fails
- Biometric only works if password entered once per session

**Rate Limiting:**
- 5 failed attempts → 1 minute wait
- 10 failed attempts → 5 minute wait
- 20 failed attempts → account lock (manual unlock required)

#### **P2P Connection Authentication**

**Sync Code Authentication:**
```
Device A: Generates sync code "AB12CD"
Device B: Enters sync code "AB12CD"
         ↓
Devices exchange public key certificates (self-signed)
         ↓
Verify sync code matches on both devices
         ↓
Establish DTLS connection
         ↓
Exchange vault data (encrypted)
```

**Device Verification:**
- Show device name on both ends (user confirms)
- Example: Device A shows "Connect to iPhone (Sarah's Phone)?"
- User confirms on Device B
- Connection established

---

### 🚨 4.4 THREAT MODELING & COUNTERMEASURES

#### **Threat 1: Brute Force Attack on Master Password**

**Threat:** Attacker tries 10,000 password combinations to unlock vault

**Countermeasures:**
1. ✅ PBKDF2 with 100,000 iterations (slows down each attempt)
2. ✅ Rate limiting (5 attempts → 1 min wait, 10 → 5 min wait)
3. ✅ Local storage only (no API endpoint to attack)
4. ✅ No indication if password is correct until full decryption succeeds

**Result:** 100,000 attempts would take 38 days. Impractical.

---

#### **Threat 2: Device Compromise (Malware)**

**Threat:** Attacker gains access to your phone/laptop, tries to access vault

**Countermeasures:**
1. ✅ Encryption keys in secure enclave (iOS Secure Enclave, Android Keystore)
2. ✅ Malware can't access enclave directly
3. ✅ Biometric/password required even with access
4. ✅ Auto-lock after 5 minutes
5. ✅ No persistent session tokens

**Result:** Even if malware gets on device, it can't access encrypted vault without password

---

#### **Threat 3: Man-in-the-Middle (MITM) Attack on Sync**

**Threat:** Attacker intercepts P2P sync, tries to read password data

**Countermeasures:**
1. ✅ DTLS encryption (end-to-end, attacker can't decrypt)
2. ✅ Certificate pinning (verify device certificates)
3. ✅ HMAC verification (detects tampering)
4. ✅ Forward secrecy (each session gets new keys)

**Result:** Attacker sees encrypted data but can't decrypt (no keys)

---

#### **Threat 4: Password Extraction from Memory**

**Threat:** Attacker dumps device memory while app is running, reads password

**Countermeasures:**
1. ✅ Don't store master password in memory
2. ✅ Clear password from memory after use (overwrite with random bytes)
3. ✅ Use secure memory buffers (if available)
4. ✅ Minimize plaintext password lifetime

**Implementation:**
```javascript
// Store password securely
let masterPassword = getUserInput();

// Derive key immediately
const key = pbkdf2(masterPassword, salt, 100000, 32, 'sha256');

// Clear password from memory
masterPassword.split('').forEach((char, i) => {
  masterPassword = masterPassword.substring(0, i) + '0' + masterPassword.substring(i + 1);
});
masterPassword = null;

// Use key (never use original password again)
const decrypted = decrypt(encryptedVault, key);

// Clear key after use
key.fill(0);
```

---

#### **Threat 5: Sync Code Interception**

**Threat:** Attacker intercepts 6-character sync code, connects to vault

**Countermeasures:**
1. ✅ Sync code expires after 5 minutes
2. ✅ Sync code only works once
3. ✅ Device verification required (user confirms on both devices)
4. ✅ Sync code only displayed on screen (not transmitted)

**Result:** Even if attacker gets code, they must confirm on your device (you'll see "Connecting to [device name]")

---

#### **Threat 6: Stolen Device**

**Threat:** Attacker steals your phone/laptop, tries to access vault

**Countermeasures:**
1. ✅ Automatic lock after 5 minutes
2. ✅ Biometric/password required to unlock
3. ✅ Encryption keys in secure enclave (can't be extracted)
4. ✅ Remote wipe option (from another device)

**Result:** Thief can't access vault without password. Password not stored anywhere.

---

#### **Threat 7: Cloud Backup Exposure**

**Threat:** User's phone auto-backs up to iCloud/Google Drive, backup exposed

**Countermeasures:**
1. ✅ Exclude app database from cloud backup
2. ✅ Clear sensitive data before backup
3. ✅ Warn user if cloud backup is enabled

**Implementation (iOS):**
```swift
// Mark database file to exclude from iCloud backup
do {
  var attributes = try FileManager.default.attributesOfItem(atPath: databasePath)
  attributes[FileAttributeKey.protectionKey] = FileProtectionType.completeUntilFirstUserAuthentication
  try FileManager.default.setAttributes(attributes, ofItemAtPath: databasePath)
} catch {
  // Handle error
}
```

**Implementation (Android):**
```xml
<!-- AndroidManifest.xml -->
<application android:allowBackup="false" ...>
  <!-- Don't backup sensitive data -->
</application>
```

---

#### **Threat 8: Database File Theft**

**Threat:** Attacker copies encrypted database file, tries to brute force locally

**Countermeasures:**
1. ✅ AES-256-GCM encryption (unbreakable with current technology)
2. ✅ PBKDF2 with 100,000 iterations (slows down offline attacks)
3. ✅ Authentication tag (HMAC) prevents tampering/corruption
4. ✅ Salt is random per installation

**Result:** File is useless without master password. Brute forcing 100,000 iterations per attempt is computational infeasible for 256-bit encryption.

**Math:** 
- 100,000 PBKDF2 iterations per guess
- Modern GPU: ~100M hashes/second
- 1000 guesses = 100 days on GPU
- 2^256 possible keys = universe age not enough time

---

#### **Threat 9: TURN Server Compromise**

**Threat:** Attacker compromises TURN relay server, tries to read data

**Countermeasures:**
1. ✅ End-to-end encryption (DTLS encrypts before sending to TURN)
2. ✅ TURN sees only encrypted bytes
3. ✅ No keys stored on TURN
4. ✅ Use trusted TURN provider (or host your own)

**Result:** Even if TURN is compromised, attacker sees only encrypted data with no way to decrypt

---

#### **Threat 10: Phishing Attack**

**Threat:** Attacker tricks user into entering password on fake website

**Countermeasures:**
1. ✅ Mobile app (harder to phish than web)
2. ✅ Official app only on App Store / Play Store
3. ✅ No login required (no phishing page to fake)
4. ✅ User education (warn about phishing)

**Result:** App can't be phished (no login page). Only risk is malicious app in store (we use code signing)

---

### 🔒 4.5 SECURE CODING PRACTICES

**Language & Framework Security:**
- ✅ Use Node.js crypto module (audited, battle-tested)
- ✅ SQLCipher for database encryption (widely used)
- ✅ Avoid eval(), exec(), or dynamic code execution
- ✅ Input validation on all fields
- ✅ Output encoding (prevent injection attacks)

**Dependency Management:**
- ✅ Use npm audit regularly
- ✅ Only import trusted dependencies
- ✅ Pin dependency versions
- ✅ Remove unused dependencies

**Error Handling:**
- ✅ Don't leak sensitive data in error messages
- ✅ Log errors securely (not to cloud)
- ✅ Show generic errors to user ("Decryption failed")
- ✅ Don't reveal implementation details

**Memory Management:**
- ✅ Clear sensitive variables after use
- ✅ Use Uint8Array for cryptographic keys (typed arrays)
- ✅ Don't use plain strings for passwords
- ✅ Minimize password lifetime in memory

---

### 🛡️ 4.6 INFRASTRUCTURE SECURITY

**What We Host (Minimal):**
1. TURN relay (only relays encrypted data, can't decrypt)
2. Website (vaultsync.app)
3. API (minimal, mostly for account features)
4. Apple/Google Play Store integration

**What We DON'T Host:**
- ❌ Your passwords (stored only on your devices)
- ❌ Your encryption keys (generated only on your devices)
- ❌ Your vault backups (stored locally only)
- ❌ Your sync data (P2P only, not stored on servers)

**Server Security:**
- ✅ HTTPS everywhere (TLS 1.3+)
- ✅ DDoS protection
- ✅ Rate limiting on all endpoints
- ✅ CORS headers (prevent cross-site access)
- ✅ Security headers (CSP, X-Frame-Options, etc.)

**Database Security (for user accounts, not passwords):**
- ✅ PostgreSQL with encryption at rest
- ✅ Connection pooling (not exposing connections)
- ✅ SQL parameterization (prevent SQL injection)
- ✅ Read-only replicas for backups

---

## 5️⃣ TECHNICAL SPECIFICATIONS

### 5.1 Technology Stack

**Frontend:**
- React Native (iOS/Android)
- Electron (macOS/Windows)
- React (Web PWA)
- TypeScript (type safety)

**Backend:**
- Node.js (sync server, API)
- Express (HTTP server)
- Socket.io (real-time updates)
- PostgreSQL (user accounts only, not passwords)
- Redis (caching, rate limiting)

**Infrastructure:**
- Vercel (frontend deployment)
- AWS / DigitalOcean (backend)
- Coturn (TURN relay)
- CloudFlare (DDoS protection, DNS)

**Security Libraries:**
- crypto (Node.js native)
- SQLCipher (database encryption)
- libsodium (if needed for additional crypto)
- DTLS 1.2 (WebRTC built-in)

**Development:**
- Git (version control)
- GitHub (source code)
- GitHub Actions (CI/CD)
- Sentry (error tracking, but no sensitive data)

---

### 5.2 Database Schema

**Note:** This schema stores only user account info. Passwords are NEVER stored on server.

```sql
-- Users table (minimal data)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(255),
  password_hash VARCHAR(255), -- Only for login, not vault password
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  subscription_tier VARCHAR(50), -- free, personal, team, business
  stripe_customer_id VARCHAR(255)
);

-- Devices table (for sync)
CREATE TABLE devices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_name VARCHAR(255), -- "Sarah's iPhone"
  device_type VARCHAR(50), -- ios, android, macos, windows, web
  public_key TEXT, -- For team vault encryption
  last_sync TIMESTAMP,
  is_active BOOLEAN,
  created_at TIMESTAMP
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50), -- owner, admin, member
  is_active BOOLEAN,
  joined_at TIMESTAMP,
  removed_at TIMESTAMP
);

-- Audit logs table (no sensitive data)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255), -- "viewed_vault", "member_added", "password_changed"
  resource_type VARCHAR(50), -- "password", "team", "device"
  timestamp TIMESTAMP,
  ip_address VARCHAR(255),
  user_agent TEXT
);

-- Sync metadata (not passwords)
CREATE TABLE sync_history (
  id UUID PRIMARY KEY,
  device_id_1 UUID REFERENCES devices(id),
  device_id_2 UUID REFERENCES devices(id),
  sync_time TIMESTAMP,
  status VARCHAR(50), -- success, failed
  error_message TEXT
);

-- Recovery codes table
CREATE TABLE recovery_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code_hash VARCHAR(255), -- hashed, never stored plaintext
  used_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Subscription table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50), -- personal, team, business
  status VARCHAR(50), -- active, past_due, canceled
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP,
  canceled_at TIMESTAMP
);
```

---

## 6️⃣ DATA FLOW & ARCHITECTURE

### 6.1 Personal Vault (Single Device)

```
User Types Master Password
         ↓
PBKDF2 Key Derivation (100k iterations)
         ↓
Encryption Key Generated
         ↓
User clicks "Add Password"
         ↓
Password Entry: {website, username, password, notes}
         ↓
AES-256-GCM Encryption
         ↓
Encrypted Entry stored in SQLCipher database
         ↓
Local device storage only (no server)
         ↓
User views password
         ↓
Request master password (or biometric)
         ↓
Decrypt with local key
         ↓
Show password
         ↓
Auto-lock after 5 minutes
```

### 6.2 Multi-Device Sync (P2P)

```
Device A (Sender)                    Device B (Receiver)
   ↓                                        ↓
User initiates sync                  User initiates sync
   ↓                                        ↓
Display: "Sync code: AB12CD"         Display: "Enter sync code"
   ↓                                        ↓
[User enters AB12CD on Device B]    
   ↓                                        ↓
   ↓←─ Sync code sent via Signal server
   ↓                                        ↓
Both devices verify sync code matches
   ↓                                        ↓
Exchange certificate info (self-signed)
   ↓                                        ↓
DTLS handshake between Device A & B (encrypted channel established)
   ↓                                        ↓
Device A encrypts vault with its key
   ↓                                        ↓
                  Send encrypted vault over DTLS
                                   ↓
                           Device B receives
                                   ↓
                    Device B decrypts with its key
                                   ↓
                    Merge with Device B's vault
                                   ↓
Both devices now have same passwords
   ↓                                        ↓
Background sync every 5 min          Background sync every 5 min
(When online)                        (When online)
   ↓                                        ↓
Changes on A automatically           Changes on B automatically
sync to B (encrypted)                sync to A (encrypted)
```

### 6.3 Team Vault (Shared Passwords)

```
Device A (Owner)
   ↓
Create team vault "Company Passwords"
   ↓
Generate random team encryption key (256-bit)
   ↓
Encrypt team vault with team key
   ↓
Encrypt team key with owner's private key
   ↓
Store: [encrypted_team_key_for_owner | encrypted_team_vault]
   ↓
Owner adds member (Bob)
   ↓
Get Bob's public key
   ↓
Encrypt team key with Bob's public key
   ↓
Send to Bob: [team_vault_encrypted | team_key_encrypted_with_bob_pk]
   ↓
Bob's Device:
   ↓
Receive encrypted team vault + team key
   ↓
Decrypt team key using Bob's private key
   ↓
Decrypt team vault using team key
   ↓
Bob now sees shared passwords
   ↓
When Bob accesses password:
   ↓
Password decrypt happens on Bob's device (not on server)
   ↓
No password data ever leaves Bob's device unencrypted
   ↓
Owner removes Bob:
   ↓
Owner generates NEW team encryption key
   ↓
Re-encrypt team vault with new key
   ↓
Send new encrypted team key to remaining members (old key useless to Bob)
   ↓
Bob's old key can't decrypt new team vault
   ↓
Bob loses access instantly (no server delay)
```

---

## 7️⃣ USER FLOWS

### Flow 1: First Launch & Setup

```
User launches app
     ↓
Welcome screen "Your passwords. Your devices. No server."
     ↓
User creates master password (12+ characters)
     ↓
System validates:
  - At least 12 characters
  - Mix of uppercase, lowercase, numbers
  - Not common password (checked against list)
     ↓
System generates:
  - Encryption key (PBKDF2)
  - 10 recovery codes
     ↓
User shown recovery codes
  - "Store these somewhere safe"
  - Offer to print or save to notes
  - Confirm user has saved
     ↓
Setup biometric (optional)
  - "Use Face ID to unlock?"
  - Explain: Biometric unlocks vault, doesn't encrypt it
     ↓
Vault created and ready
     ↓
"Your vault is secure. Only on this device."
     ↓
User can start adding passwords
```

### Flow 2: Add Password

```
User clicks "+"
     ↓
Form appears:
  - Website/App name
  - Username
  - Password (generate or paste)
  - Notes (optional)
  - Folder/Tag (optional)
     ↓
User fills form
     ↓
User clicks "Save"
     ↓
Prompt for master password (if not used in 5 min)
     ↓
Encrypt entry with master key
     ↓
Store in local encrypted database
     ↓
"Password saved ✓"
     ↓
Entry visible in vault
```

### Flow 3: Sync Between Devices

```
User on iPhone: Opens app, clicks "Settings"
     ↓
Clicks "Sync devices"
     ↓
Screen shows: "Sync code: AB12CD" (valid for 5 minutes)
     ↓
User goes to laptop
     ↓
Opens app, clicks "Sync devices"
     ↓
Enters code "AB12CD"
     ↓
System shows: "Connecting to iPhone..."
     ↓
iPhone shows prompt: "Confirm: Sync with MacBook?"
     ↓
User taps "Confirm" on iPhone
     ↓
DTLS connection established
     ↓
Encrypted sync happens
     ↓
"Synced ✓" on both devices
     ↓
Devices show: "Auto-sync enabled. Last sync: just now"
     ↓
From now on:
  - Changes on iPhone auto-sync to Mac (encrypted)
  - Changes on Mac auto-sync to iPhone (encrypted)
  - No server involved
```

### Flow 4: Create Team & Share Passwords

```
User clicks "Create Team"
     ↓
Enters team name "Company"
     ↓
System generates team encryption key
     ↓
User adds members (by email)
     ↓
System sends invitation email to member
     ↓
Member receives email: "You're invited to Company vault"
     ↓
Member clicks link, installs app or logs in
     ↓
App shows: "You've been added to Company vault"
     ↓
System encrypts team key with member's public key
     ↓
Member's device receives encrypted team key
     ↓
Member decrypts team key using their private key
     ↓
Member can now see shared passwords (decrypted on their device)
     ↓
Owner can move passwords to "Company" vault
     ↓
All members see updates instantly (encrypted P2P sync)
     ↓
When member removed:
     ↓
Owner generates new team key
     ↓
Re-encrypts team vault
     ↓
Sends new key to remaining members
     ↓
Old member's key becomes useless
     ↓
Old member loses access instantly
```

---

## 8️⃣ MOBILE SPECIFICATIONS

### iOS App

**Platform:** iOS 14+  
**Language:** Swift or React Native  
**Package:** VaultSync.app

**Features:**
- ✅ Touch ID / Face ID unlock
- ✅ Secure enclave for keys
- ✅ Background sync (silent push notifications)
- ✅ iCloud Keychain integration (optional emergency backup)
- ✅ Auto-fill for passwords (using iOS's password manager API)
- ✅ App-to-App communication (share passwords with other apps)
- ✅ Extensions (share passwords from Safari)

**Security:**
```swift
// Secure enclave for encryption key
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: "com.vaultsync.encryption-key",
    kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
    kSecUseDataProtectionKeychain as String: true
]

// Biometric unlock
let context = LAContext()
var error: NSError?

if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
    context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Unlock your vault"
    ) { success, error in
        if success {
            // Grant access to secure enclave
        }
    }
}

// Don't backup vault to iCloud
let fileURL = URL(fileURLWithPath: vaultDatabasePath)
var attributes = try FileManager.default.attributesOfItem(atPath: fileURL.path)
attributes[FileAttributeKey.protectionKey] = FileProtectionType.completeUntilFirstUserAuthentication
try FileManager.default.setAttributes(attributes, ofItemAtPath: fileURL.path)
```

### Android App

**Platform:** Android 8+  
**Language:** Kotlin or React Native  
**Package:** com.vaultsync.app

**Features:**
- ✅ Biometric unlock (fingerprint, face)
- ✅ Hardware-backed keystore
- ✅ Background sync
- ✅ Auto-fill service
- ✅ Trusted boot verification
- ✅ Work profile support (MDM)

**Security:**
```kotlin
// Hardware-backed keystore
val keyGenerator = KeyGenerator.getInstance(
    KeyProperties.KEY_ALGORITHM_AES,
    "AndroidKeyStore"
)

keyGenerator.init(
    KeyGenParameterSpec.Builder(
        "vaultsync_key",
        KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
    )
        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
        .setIsStrongBoxBacked(true) // Use hardware security module if available
        .build()
)

val key = keyGenerator.generateKey()

// Biometric unlock
val biometricPrompt = BiometricPrompt(this, executor, callback)
val promptInfo = BiometricPrompt.PromptInfo.Builder()
    .setTitle("Unlock your vault")
    .setNegativeButtonText("Cancel")
    .build()

biometricPrompt.authenticate(promptInfo)
```

---

## 9️⃣ DESKTOP SPECIFICATIONS

### macOS App

**Platform:** macOS 10.15+  
**Language:** Electron + React  
**Distribution:** App Store + Direct download

**Features:**
- ✅ Touch Bar integration
- ✅ Spotlight search (find passwords)
- ✅ Safari extension (fill passwords)
- ✅ System keychain integration (for recovery)
- ✅ Command-line interface (optional)

### Windows App

**Platform:** Windows 10/11  
**Language:** Electron + React  
**Distribution:** Windows Store + Direct download

**Features:**
- ✅ Windows Hello (face/fingerprint)
- ✅ Credential Manager integration
- ✅ Microsoft Edge extension
- ✅ Chrome extension
- ✅ Context menu integration

---

## 🔟 COMPLIANCE & PRIVACY

### 10.1 Regulatory Compliance

**GDPR (EU):**
- ✅ Privacy by design (no data collection by default)
- ✅ Right to deletion (user can delete account + all data)
- ✅ Data portability (export vault)
- ✅ Privacy policy (transparent about what we collect)
- ✅ Consent (explicit opt-in for analytics)

**CCPA (California):**
- ✅ Right to know (what data we have)
- ✅ Right to delete (request deletion)
- ✅ Right to opt-out (disable analytics)
- ✅ No selling data (we don't sell anything)

**HIPAA (Healthcare):**
- ✅ Encryption at rest + in transit
- ✅ Access controls (only user)
- ✅ Audit logs (if storing health credentials)
- ✅ Business associate agreement (available)

**SOC 2 Type II Compliance:**
- ✅ Security (encryption, key management)
- ✅ Availability (99.9% uptime SLA)
- ✅ Processing integrity (no data loss)
- ✅ Confidentiality (zero-knowledge)
- ✅ Privacy (GDPR compliant)

### 10.2 Privacy Policy Highlights

**Data Collection:**
- ✅ Email (for login only, not shared)
- ✅ Device name (for sync, stored locally)
- ✅ Subscription info (for billing)
- ✅ Analytics (opt-in only, anonymized)

**Data We DON'T Collect:**
- ❌ Passwords (never stored on our servers)
- ❌ Vault contents (stored only on your devices)
- ❌ Encryption keys (generated only on your devices)
- ❌ Sync data (P2P only, not stored)
- ❌ Browsing history
- ❌ IP addresses (for sync)

**Data Retention:**
- ✅ Email & subscription: stored indefinitely (needed for account)
- ✅ Audit logs: 90 days (for security)
- ✅ Backups: 30 days (disaster recovery)
- ✅ Delete account: all data deleted within 30 days

---

## 1️⃣1️⃣ BUILD ROADMAP

### Week 1-2: Core Vault (Personal Storage)

**Deliverables:**
- ✅ React Native app (iOS + Android)
- ✅ Electron app (macOS + Windows)
- ✅ React web app (PWA)
- ✅ Master password setup
- ✅ Add/view/edit/delete passwords
- ✅ Encryption (AES-256-GCM locally)
- ✅ Biometric unlock
- ✅ Recovery codes
- ✅ Auto-lock after 5 min

**Architecture:**
- SQLCipher (encrypted local database)
- PBKDF2 (key derivation)
- Crypto (native encryption)
- Simple UI (just vault)

---

### Week 3-4: Multi-Device Sync

**Deliverables:**
- ✅ P2P sync setup (sync code + WebRTC)
- ✅ DTLS encryption
- ✅ Device management (add/remove devices)
- ✅ Conflict resolution (if both devices edit same password)
- ✅ Sync status indicator
- ✅ Manual & background sync

**New Components:**
- WebRTC data channel
- TURN relay server
- Sync conflict algorithm
- Device certificate management

---

### Week 5-6: Team & Sharing

**Deliverables:**
- ✅ Create teams
- ✅ Add/remove members
- ✅ Shared vaults (team passwords)
- ✅ Audit logs
- ✅ Member roles (owner, admin, member)
- ✅ Invite system

**New Components:**
- Public key cryptography (for team key encryption)
- Team membership database
- Audit logging
- Email invitations

---

### Week 7+: Launch & Scale

**Before Launch:**
- ✅ Security audit (external)
- ✅ Penetration testing
- ✅ Code review
- ✅ User testing (10-20 beta users)

**Launch:**
- ✅ ProductHunt
- ✅ GitHub (open-source)
- ✅ App Store (iOS)
- ✅ Google Play (Android)
- ✅ Website

**Monetization:**
- ✅ Stripe integration
- ✅ Subscription management
- ✅ Usage tracking (for limits)

---

## 1️⃣2️⃣ SECURITY CHECKLIST (Before Launch)

### Pre-Launch Security Audit

**Code Security:**
- ☐ No hardcoded secrets (API keys, etc)
- ☐ No logging of sensitive data
- ☐ Input validation on all fields
- ☐ SQL injection prevention (parameterized queries)
- ☐ XSS prevention (output encoding)
- ☐ CSRF protection (for web app)
- ☐ Dependency check (npm audit, no vulnerabilities)

**Encryption Security:**
- ☐ PBKDF2 with 100,000+ iterations
- ☐ Random salt per user (32 bytes)
- ☐ AES-256-GCM for data encryption
- ☐ DTLS 1.2 for P2P sync
- ☐ Forward secrecy (new keys per session)
- ☐ No ECB mode (only GCM/CBC)
- ☐ Authentication tags verified

**Key Management:**
- ☐ Keys generated on-device (never transmitted)
- ☐ Keys stored in secure enclave/keystore (iOS/Android)
- ☐ Keys cleared from memory after use
- ☐ No key backup on cloud (except encrypted backup)
- ☐ Recovery codes generated & stored securely

**Infrastructure:**
- ☐ HTTPS/TLS 1.3+ everywhere
- ☐ HSTS headers enabled
- ☐ CSP headers set correctly
- ☐ CORS properly configured
- ☐ DDoS protection enabled
- ☐ Rate limiting on all endpoints
- ☐ Server firewall properly configured

**Testing:**
- ☐ Brute force testing (failed login limits)
- ☐ Encryption validation (decryption works)
- ☐ Sync testing (P2P works correctly)
- ☐ Offline testing (works without internet)
- ☐ Conflict resolution testing (synced data is correct)
- ☐ Malware testing (check for injection vectors)
- ☐ Memory testing (no sensitive data leaks)

**Infrastructure Security:**
- ☐ Server logs don't contain passwords
- ☐ Database backups encrypted
- ☐ Database access restricted
- ☐ Secrets management (use env vars)
- ☐ API keys rotated regularly
- ☐ SSL certificates current & valid

**Privacy & Compliance:**
- ☐ Privacy policy written & published
- ☐ Terms of service written
- ☐ GDPR compliance verified
- ☐ CCPA compliance verified
- ☐ No analytics of sensitive data
- ☐ Data deletion process tested
- ☐ Audit logs working correctly

**Documentation:**
- ☐ Security documentation for developers
- ☐ Threat model documented
- ☐ Incident response plan created
- ☐ Security FAQ for users
- ☐ Bug bounty program launched
- ☐ PGP key for security researchers

---

## 🎯 SUMMARY

**VaultSync is:**
- ✅ Actually private (zero-knowledge architecture)
- ✅ Works offline (no server required)
- ✅ P2P synced (encrypted, no middleman)
- ✅ Team-ready (encrypted sharing)
- ✅ Affordable ($0.99-3/month)
- ✅ Open-source (community auditable)
- ✅ Future-proof (revenue models planned)

**Build Timeline:** 4-6 weeks  
**Launch Target:** 8 weeks  
**Revenue Potential:** $15M+/year at scale

**Ready to build. Let's go. 🚀**
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-13T10:01:14+05:30.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Claude Opus 4.6 (Thinking). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>