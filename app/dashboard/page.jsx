'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Star,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  Edit3,
  Sliders,
  Download,
  Upload,
  LayoutGrid,
  List,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  X,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Dices,
  Laptop,
  Settings,
  LogOut,
  Clock,
  User as UserIcon,
  Database,
  Info,
  FileText,
  Printer,
  Sparkles,
  History,
  ShieldAlert,
  Briefcase,
  CreditCard,
  Film,
  ShoppingBag,
  Folder,
  Layers
} from 'lucide-react';
import {
  deriveMasterKey,
  encryptVaultSecret,
  decryptVaultSecret,
  exportRawKey,
  importRawKey,
  generateTOTPCode,
  isValidBase32,
  extractTOTPSecret
} from '../../lib/crypto/vaultCrypto';
import CompanyLogo from '../components/CompanyLogo';
import VaultSyncLogo, { VaultSyncLogoIcon } from '../components/VaultSyncLogo';
import { resolveCompanyDomain } from '../../lib/utils/logoFetcher';
import {
  getVaultData,
  saveVerifier,
  addVaultItem,
  updateVaultItem,
  deleteVaultItem,
  resetVault
} from '../../lib/storage/clientVaultStorage';
import {
  sanitizeSafeUrl,
  sanitizeTextInput,
  getLockoutDuration
} from '../../lib/utils/security';

// Entropy & Password Strength Calculator
function calculateStrength(pw = '') {
  if (!pw) return 'Weak';
  let score = 0;
  if (pw.length >= 8) score += 20;
  if (pw.length >= 12) score += 25;
  if (pw.length >= 16) score += 15;
  if (/[A-Z]/.test(pw)) score += 10;
  if (/[a-z]/.test(pw)) score += 10;
  if (/[0-9]/.test(pw)) score += 10;
  if (/[^A-Za-z0-9]/.test(pw)) score += 10;

  if (score >= 75) return 'Strong';
  if (score >= 45) return 'Moderate';
  return 'Weak';
}

function calculateEntropy(pw = '') {
  if (!pw) return 0;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
  if (pool === 0) pool = 26;
  return Math.round(pw.length * Math.log2(pool));
}

// Configurable High-Entropy Password Generator
function generateSecurePassword(
  length = 16,
  includeUpper = true,
  includeLower = true,
  includeNumbers = true,
  includeSymbols = true,
  avoidAmbiguous = false
) {
  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (avoidAmbiguous) {
    upper = upper.replace(/[IO]/g, '');
    lower = lower.replace(/[lo]/g, '');
    numbers = numbers.replace(/[01]/g, '');
    symbols = symbols.replace(/[|;:,.<>]/g, '');
  }

  let charPool = '';
  if (includeUpper) charPool += upper;
  if (includeLower) charPool += lower;
  if (includeNumbers) charPool += numbers;
  if (includeSymbols) charPool += symbols;
  if (!charPool) charPool = lower + numbers;

  // Cryptographically secure pseudo-random values
  const buffer = new Uint32Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(buffer);
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    const rand = buffer[i] !== undefined ? buffer[i] : Math.floor(Math.random() * 1000000);
    result += charPool.charAt(rand % charPool.length);
  }
  return result;
}

// Google Chrome & Generic Password CSV Parser
function parseChromeOrGenericCSV(csvText) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentLine.push(currentField.trim());
      if (currentLine.some((f) => f.length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some((f) => f.length > 0)) {
      lines.push(currentLine);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const nameIdx = headers.findIndex((h) => ['name', 'title', 'account', 'loginname', 'sitename'].includes(h));
  const urlIdx = headers.findIndex((h) => ['url', 'loginuri', 'website', 'address', 'link'].includes(h));
  const userIdx = headers.findIndex((h) => ['username', 'loginusername', 'user', 'email', 'login'].includes(h));
  const passIdx = headers.findIndex((h) => ['password', 'loginpassword', 'pass'].includes(h));
  const noteIdx = headers.findIndex((h) => ['note', 'notes', 'comment', 'description'].includes(h));
  const totpIdx = headers.findIndex((h) => ['totp', 'otp', 'logintotp', 'totpsecret', 'otpsecret', 'twofactor', '2fa', 'authenticator'].includes(h));
  const catIdx = headers.findIndex((h) => ['folder', 'category', 'grouping', 'type', 'group'].includes(h));

  const items = [];
  const allowedCategories = ['Logins', 'Work', 'Entertainment', 'Productivity', 'Shopping', 'Finance', 'Other'];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const password = passIdx !== -1 ? (row[passIdx] || '') : '';
    if (!password) continue;

    const url = urlIdx !== -1 ? (row[urlIdx] || '') : '';
    const rawName = nameIdx !== -1 ? (row[nameIdx] || '') : '';
    const username = userIdx !== -1 ? (row[userIdx] || '') : '';
    const notes = noteIdx !== -1 ? (row[noteIdx] || '') : '';
    const rawTotp = totpIdx !== -1 ? (row[totpIdx] || '') : '';
    const cleanTotp = extractTOTPSecret(rawTotp);

    const rawCategory = catIdx !== -1 ? (row[catIdx] || '').trim() : '';
    const matchedCategory = allowedCategories.find((c) => c.toLowerCase() === rawCategory.toLowerCase()) || 'Logins';

    const resolvedName = rawName || (url ? resolveCompanyDomain(url) : `Imported Account ${i}`);

    items.push({
      id: `import_${i}_${Date.now()}`,
      name: resolvedName,
      url: url,
      username: username,
      password: password,
      notes: notes,
      totpSecret: cleanTotp,
      category: matchedCategory,
      strength: calculateStrength(password),
      selected: true
    });
  }
  return items;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const searchInputRef = useRef(null);
  const clipboardTimerRef = useRef(null);

  // User identity derived from Clerk
  const user = useMemo(() => {
    if (!clerkUser) return { id: null, email: '', name: '', avatar: '' };
    const email = clerkUser.primaryEmailAddress?.emailAddress || '';
    const name = clerkUser.fullName || clerkUser.firstName || (email ? email.split('@')[0] : 'VaultSyncc User');
    return {
      id: clerkUser.id,
      email,
      name,
      avatar: clerkUser.imageUrl
    };
  }, [clerkUser]);

  // Vault Items State
  const [vaultItems, setVaultItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'name' | 'strength'

  // Zero-Knowledge Master Key & Vault Lock State
  const [cryptoKey, setCryptoKey] = useState(null);
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [storedVerifier, setStoredVerifier] = useState(null);
  const [storedVerifierIv, setStoredVerifierIv] = useState(null);
  const [hasExistingVault, setHasExistingVault] = useState(false);
  const [isCheckingVaultStatus, setIsCheckingVaultStatus] = useState(true);
  const [isResettingVault, setIsResettingVault] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [confirmUnlockPassword, setConfirmUnlockPassword] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [showUnlockPass, setShowUnlockPass] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [failedUnlockAttempts, setFailedUnlockAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [isLoadingVault, setIsLoadingVault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cloudSyncSource, setCloudSyncSource] = useState('vault_storage');

  // UI Action states
  const [revealedIds, setRevealedIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [copiedUsernameId, setCopiedUsernameId] = useState(null);
  const [copiedTotpId, setCopiedTotpId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // 2FA TOTP state
  const [totpCodes, setTotpCodes] = useState({});
  const [totpTimeRemaining, setTotpTimeRemaining] = useState(30);

  // Active Clipboard Memory Guard state
  const [clipboardGuard, setClipboardGuard] = useState({
    active: false,
    countdown: 0,
    type: 'Password'
  });

  // Add Item Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [isAddUrlCustomized, setIsAddUrlCustomized] = useState(false);
  const [newItemUser, setNewItemUser] = useState('');
  const [newItemPass, setNewItemPass] = useState('');
  const [newItemTotp, setNewItemTotp] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Logins');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemIsFav, setNewItemIsFav] = useState(false);
  const [passCreationMode, setPassCreationMode] = useState('generate'); // 'generate' (VaultSync) | 'custom' (User's own)
  const [showNewItemPass, setShowNewItemPass] = useState(true);

  // Edit Item Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemUrl, setEditItemUrl] = useState('');
  const [editItemUser, setEditItemUser] = useState('');
  const [editItemPass, setEditItemPass] = useState('');
  const [editItemTotp, setNewItemTotpEdit] = useState('');
  const [editItemHistory, setEditItemHistory] = useState([]);
  const [editItemCategory, setEditItemCategory] = useState('Logins');
  const [editItemNotes, setEditItemNotes] = useState('');
  const [editItemIsFav, setEditItemIsFav] = useState(false);
  const [editPassCreationMode, setEditPassCreationMode] = useState('custom'); // 'custom' | 'generate'
  const [showEditItemPass, setShowEditItemPass] = useState(false);

  // Import from Chrome / CSV Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importParsedItems, setImportParsedItems] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Standalone Password Generator Modal state
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);
  const [genAvoidAmbiguous, setGenAvoidAmbiguous] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedGen, setCopiedGen] = useState(false);

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Settings Modal state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('security'); // 'security' | 'autolock' | 'account' | 'data'
  const [autoLockMinutes, setAutoLockMinutes] = useState(15);
  const [newMasterPass, setNewMasterPass] = useState('');
  const [confirmMasterPass, setConfirmMasterPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [changePassError, setChangePassError] = useState('');

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  }, []);

  // Lock Vault Handler
  const handleLockVault = useCallback(() => {
    if (typeof window !== 'undefined' && user.id) {
      sessionStorage.removeItem('vaultsync_active_key_' + user.id);
    }
    setCryptoKey(null);
    setIsVaultLocked(true);
    setTotpCodes({});
    if (clipboardTimerRef.current) clearInterval(clipboardTimerRef.current);
    setClipboardGuard({ active: false, countdown: 0, type: 'Password' });
    setVaultItems((prev) =>
      prev.map((i) => ({
        ...i,
        password: '••••••••••••',
        notes: '',
        totpSecret: '',
        passwordHistory: []
      }))
    );
    triggerToast('Vault locked securely.');
  }, [triggerToast, user.id]);

  // Reset Vault Handler (wipes data and restarts master key setup)
  const handleResetVault = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to completely reset your encrypted vault?\\n\\nAll stored passwords will be permanently deleted and you can set a brand new master password.'
    );
    if (!confirmed) return;

    try {
      setIsResettingVault(true);
      resetVault(user.id);

      if (typeof window !== 'undefined' && user.id) {
        sessionStorage.removeItem('vaultsync_active_key_' + user.id);
      }

      setCryptoKey(null);
      setVaultItems([]);
      setStoredVerifier(null);
      setStoredVerifierIv(null);
      setHasExistingVault(false);
      setIsSetupMode(true);
      setUnlockPassword('');
      setConfirmUnlockPassword('');
      setUnlockError('');
      setIsVaultLocked(true);
      triggerToast('Vault reset! You can now create a new master password.');
    } catch (err) {
      console.error('Reset vault error:', err);
      setUnlockError('Failed to reset vault: ' + (err.message || 'Please check connection'));
    } finally {
      setIsResettingVault(false);
    }
  };

  // Keyboard shortcut listener (Cmd/Ctrl + K for search, Cmd/Ctrl + L for lock, Cmd/Ctrl + N for add, Esc for close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLockVault();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setNewItemName('');
        setNewItemUrl('');
        setNewItemUser(user.email || '');
        setNewItemPass(generateSecurePassword(16, true, true, true, true));
        setNewItemCategory('Logins');
        setNewItemNotes('');
        setNewItemIsFav(false);
        setIsAddModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsGeneratorModalOpen(false);
        setIsExportModalOpen(false);
        setIsSettingsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLockVault, user.email]);

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedMode = localStorage.getItem('vaultsync_view_mode');
      if (savedMode === 'grid' || savedMode === 'list') {
        setViewMode(savedMode);
      }
      const savedAutoLock = localStorage.getItem('mypass_autolock_minutes');
      if (savedAutoLock !== null) {
        const parsed = parseInt(savedAutoLock, 10);
        if (!isNaN(parsed)) setAutoLockMinutes(parsed);
      }
    } catch {}
  }, []);

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vaultsync_view_mode', mode);
      } catch {}
    }
  };

  // Initialize Generator Password
  useEffect(() => {
    setGeneratedPassword(
      generateSecurePassword(genLength, genUpper, genLower, genNumbers, genSymbols, genAvoidAmbiguous)
    );
  }, [genLength, genUpper, genLower, genNumbers, genSymbols, genAvoidAmbiguous]);

  const handleRegenStandalone = () => {
    setGeneratedPassword(
      generateSecurePassword(genLength, genUpper, genLower, genNumbers, genSymbols, genAvoidAmbiguous)
    );
  };

  // Load and Decrypt all records from client-side storage
  const loadVaultData = useCallback(async (key, authUserId) => {
    if (!authUserId) return false;
    setIsLoadingVault(true);
    try {
      let rawItems = [];

      // 1. Load from client-side localStorage (zero-knowledge: never touches server)
      const data = getVaultData(authUserId);
      rawItems = data.items || [];
      if (data.source) setCloudSyncSource(data.source);
      if (data.verifier) setStoredVerifier(data.verifier);
      if (data.verifier_iv) setStoredVerifierIv(data.verifier_iv);
      if (typeof data.hasMasterPassword === 'boolean') {
        setHasExistingVault(data.hasMasterPassword);
      }

      // 2. Decrypt all items using AES-256-GCM if key provided
      if (rawItems.length > 0 && key) {
        let successfulDecryptCount = 0;
        let failedDecryptCount = 0;
        const decryptedList = await Promise.all(
          rawItems.map(async (row) => {
            let plainPass = '••••••••••••';
            let plainNotes = '';
            let plainTotp = '';
            let passwordHistory = [];

            if (key && row.encrypted_password && row.iv) {
              try {
                plainPass = await decryptVaultSecret(row.encrypted_password, row.iv, key);
                successfulDecryptCount++;
              } catch (decErr) {
                console.warn('Decryption error for item', row.id, decErr);
                failedDecryptCount++;
                plainPass = '••••••••••••';
              }
            }
            if (key && row.notes_encrypted && (row.notes_iv || row.iv)) {
              try {
                const decNotes = await decryptVaultSecret(row.notes_encrypted, row.notes_iv || row.iv, key);
                try {
                  const parsed = JSON.parse(decNotes);
                  if (parsed && typeof parsed === 'object') {
                    plainNotes = parsed.notes || '';
                    plainTotp = parsed.totpSecret || '';
                    passwordHistory = Array.isArray(parsed.history) ? parsed.history : [];
                  } else {
                    plainNotes = decNotes;
                  }
                } catch {
                  plainNotes = decNotes;
                }
              } catch {
                plainNotes = '';
              }
            }

            const isFav = row.auth_tag === 'fav' || row.auth_tag?.includes('fav');
            const domain = row.url || resolveCompanyDomain(row.name);

            return {
              id: row.id,
              name: row.name,
              username: row.username || '',
              password: plainPass,
              notes: plainNotes,
              totpSecret: plainTotp,
              passwordHistory: passwordHistory,
              category: row.category || 'Logins',
              strength: row.strength || calculateStrength(plainPass),
              url: domain,
              iconType: row.icon_type || domain,
              isFavorite: Boolean(isFav),
              createdAt: row.created_at || new Date().toISOString()
            };
          })
        );
        // Only reject vault unlock if there was no server canary verifier AND every single credential failed decryption
        if (!data.verifier && rawItems.length > 0 && successfulDecryptCount === 0 && failedDecryptCount > 0) {
          return false;
        }
        setVaultItems(decryptedList);
      } else if (!key) {
        // Vault is locked: keep item metadata but mask secrets
        const maskedList = rawItems.map((row) => {
          const domain = row.url || resolveCompanyDomain(row.name);
          return {
            id: row.id,
            name: row.name,
            username: row.username || '',
            password: '••••••••••••',
            notes: '',
            totpSecret: '',
            passwordHistory: [],
            category: row.category || 'Logins',
            strength: row.strength || 'Strong',
            url: domain,
            iconType: row.icon_type || domain,
            isFavorite: Boolean(row.auth_tag === 'fav'),
            createdAt: row.created_at || new Date().toISOString()
          };
        });
        setVaultItems(maskedList);
      } else {
        setVaultItems([]);
      }
      return true;
    } catch (e) {
      console.error('Failed to load vault items:', e);
      return false;
    } finally {
      setIsLoadingVault(false);
    }
  }, []);

  // Unlock Vault Handler when Master Password is submitted
  const handleUnlockVault = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setUnlockError('');
    if (lockoutTimer > 0) {
      setUnlockError(`Brute-force protection: Locked out. Please wait ${lockoutTimer} seconds.`);
      return;
    }
    if (!unlockPassword.trim()) {
      setUnlockError('Please enter your Master Password.');
      return;
    }

    if (isSetupMode) {
      if (unlockPassword.trim().length < 8) {
        setUnlockError('Master password must be at least 8 characters long.');
        return;
      }
      if (unlockPassword.trim() !== confirmUnlockPassword.trim()) {
        setUnlockError('Master passwords do not match. Please verify your password.');
        return;
      }
    }

    setIsUnlocking(true);
    try {
      const derivedKey = await deriveMasterKey(unlockPassword.trim(), user.email || 'user');

      if (isSetupMode) {
        // First-Time Setup: create cryptographic canary verifier
        const canary = await encryptVaultSecret('VAULTSYNC_KEY_VERIFIED', derivedKey);
        saveVerifier(user.id, canary.ciphertext, canary.iv);

        // Mark vault as existing BEFORE loadVaultData runs so state is consistent
        setStoredVerifier(canary.ciphertext);
        setStoredVerifierIv(canary.iv);
        setHasExistingVault(true);
        setIsSetupMode(false);
      } else {
        // Unlock Mode: verify canary if present
        if (storedVerifier && storedVerifierIv) {
          try {
            const canaryCheck = await decryptVaultSecret(storedVerifier, storedVerifierIv, derivedKey);
            if (canaryCheck !== 'VAULTSYNC_KEY_VERIFIED') {
              throw new Error('Incorrect Master Password. Please check your password and try again.');
            }
          } catch (decErr) {
            throw new Error('Incorrect Master Password. Please check your password and try again.');
          }
        }
      }

      // Load & Decrypt vault items
      const loaded = await loadVaultData(derivedKey, user.id);
      if (!loaded && !isSetupMode) {
        throw new Error('Incorrect master password or corrupted vault item data.');
      }

      // If user had existing items without a verifier, establish canary now
      if (!isSetupMode && (!storedVerifier || !storedVerifierIv)) {
        try {
          const canary = await encryptVaultSecret('VAULTSYNC_KEY_VERIFIED', derivedKey);
          saveVerifier(user.id, canary.ciphertext, canary.iv);
          setStoredVerifier(canary.ciphertext);
          setStoredVerifierIv(canary.iv);
        } catch (canErr) {
          console.warn('Canary auto-init warning:', canErr);
        }
      }

      // Store session key in sessionStorage for this browser tab session
      if (typeof window !== 'undefined' && user.id) {
        try {
          const exported = await exportRawKey(derivedKey);
          if (exported) {
            sessionStorage.setItem('vaultsync_active_key_' + user.id, exported);
          }
        } catch (expErr) {
          console.warn('Session key export warning:', expErr);
        }
      }

      setCryptoKey(derivedKey);
      setIsVaultLocked(false);
      setUnlockPassword('');
      setConfirmUnlockPassword('');
      setFailedUnlockAttempts(0);
      setLockoutTimer(0);
      triggerToast(isSetupMode ? 'Master Password initialized! Vault ready.' : 'Vault unlocked with Zero-Knowledge encryption!');
    } catch (err) {
      const nextFailed = failedUnlockAttempts + 1;
      setFailedUnlockAttempts(nextFailed);
      const lockoutDuration = getLockoutDuration(nextFailed);

      if (lockoutDuration > 0) {
        setLockoutTimer(lockoutDuration);
        const lockInt = setInterval(() => {
          setLockoutTimer((prev) => {
            if (prev <= 1) {
              clearInterval(lockInt);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setUnlockError(`Brute-force protection: ${nextFailed} failed attempts. Vault locked for ${lockoutDuration} seconds.`);
      } else {
        setUnlockError(err.message || 'Failed to unlock vault');
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  // Unauthenticated client-side redirect guard
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Check Auth & Session Key on Mount (seamless restore, no flash redirects)
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user.id) return;

    let isCancelled = false;

    async function initVaultSession() {
      setIsCheckingVaultStatus(true);
      try {
        // 1. Check if the active tab has a cached session key
        let activeKey = null;
        if (typeof window !== 'undefined') {
          const savedKeyBase64 = sessionStorage.getItem('vaultsync_active_key_' + user.id);
          if (savedKeyBase64) {
            try {
              activeKey = await importRawKey(savedKeyBase64);
            } catch (kErr) {
              console.warn('Failed to restore active tab session key:', kErr);
              sessionStorage.removeItem('vaultsync_active_key_' + user.id);
            }
          }
        }

        // 2. Load vault status from client-side storage (zero-knowledge: no server round-trip)
        let data = {};
        try {
          data = getVaultData(user.id);
        } catch (loadErr) {
          console.warn('Vault load notice:', loadErr);
        }

        if (isCancelled) return;

        const hasVault = Boolean(data.hasMasterPassword || (data.items && data.items.length > 0) || data.verifier);
        // Set hasExistingVault FIRST so the UI always shows the right screen when the overlay appears
        setHasExistingVault(hasVault);
        setIsSetupMode(!hasVault);
        if (data.verifier) setStoredVerifier(data.verifier);
        if (data.verifier_iv) setStoredVerifierIv(data.verifier_iv);
        if (data.source) setCloudSyncSource(data.source);

        if (activeKey) {
          // Tab already unlocked during this session: decrypt directly
          const loaded = await loadVaultData(activeKey, user.id);
          if (loaded) {
            setCryptoKey(activeKey);
            setIsVaultLocked(false);
            setIsSetupMode(false);
            setHasExistingVault(true);
            return;
          } else {
            sessionStorage.removeItem('vaultsync_active_key_' + user.id);
          }
        }

        // Lock screen: vault locked, show correct screen based on vault existence
        setIsVaultLocked(true);
      } catch (err) {
        console.error('Init vault error:', err);
        // On error, default to showing lock screen in create mode (safe fallback)
        setIsVaultLocked(true);
        setHasExistingVault(false);
        setIsSetupMode(true);
      } finally {
        if (!isCancelled) {
          setIsCheckingVaultStatus(false);
        }
      }
    }

    initVaultSession();

    return () => {
      isCancelled = true;
    };
  }, [isLoaded, isSignedIn, user.id, user.email, loadVaultData]);

  // Active Clipboard Memory Guard Handlers
  const triggerClipboardGuard = useCallback((type = 'Password') => {
    if (clipboardTimerRef.current) clearInterval(clipboardTimerRef.current);
    setClipboardGuard({ active: true, countdown: 30, type });

    clipboardTimerRef.current = setInterval(() => {
      setClipboardGuard((prev) => {
        if (prev.countdown <= 1) {
          clearInterval(clipboardTimerRef.current);
          if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('').catch(() => {});
          }
          triggerToast('Clipboard memory scrubbed clean for security.');
          return { active: false, countdown: 0, type: prev.type };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  }, [triggerToast]);

  const handleClearClipboardManual = useCallback(async () => {
    if (clipboardTimerRef.current) clearInterval(clipboardTimerRef.current);
    setClipboardGuard({ active: false, countdown: 0, type: 'Password' });
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText('');
      }
    } catch {}
    triggerToast('Clipboard memory wiped clean.');
  }, [triggerToast]);

  // Live TOTP Generator Countdown Effect
  useEffect(() => {
    if (isVaultLocked || !cryptoKey) return;

    let isMounted = true;
    const updateTOTP = async () => {
      const epoch = Math.floor(Date.now() / 1000);
      const rem = 30 - (epoch % 30);
      if (isMounted) setTotpTimeRemaining(rem);

      const itemsWithTotp = vaultItems.filter((i) => i.totpSecret);
      if (itemsWithTotp.length === 0) return;

      const newCodes = {};
      for (const item of itemsWithTotp) {
        try {
          const res = await generateTOTPCode(item.totpSecret);
          newCodes[item.id] =
            res.code.length === 6 ? `${res.code.slice(0, 3)} ${res.code.slice(3)}` : res.code;
        } catch (e) {
          newCodes[item.id] = 'Error';
        }
      }
      if (isMounted) setTotpCodes(newCodes);
    };

    updateTOTP();
    const interval = setInterval(updateTOTP, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isVaultLocked, cryptoKey, vaultItems]);

  // Copy helpers
  const handleCopyPassword = (text, id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!text || text === '••••••••••••') {
      triggerToast('Unlock vault to copy decrypted password');
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        triggerToast('Password copied! Auto-scrubbing memory in 30s');
        triggerClipboardGuard('Password');
        setTimeout(() => setCopiedId(null), 2000);
      });
    } else {
      triggerToast('Password copied!');
    }
  };

  const handleCopyTOTP = (code, id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!code || code === '------' || code === 'Error') return;
    const clean = code.replace(/\s+/g, '');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(clean).then(() => {
        setCopiedTotpId(id);
        triggerToast('2FA Code copied! Auto-scrubbing memory in 30s');
        triggerClipboardGuard('2FA Code');
        setTimeout(() => setCopiedTotpId(null), 2000);
      });
    }
  };

  const handleCopyUsername = (text, id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!text) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedUsernameId(id);
        triggerToast('Username copied to clipboard!');
        setTimeout(() => setCopiedUsernameId(null), 2000);
      });
    } else {
      triggerToast('Username copied!');
    }
  };

  const handleCopyStandaloneGen = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedPassword).then(() => {
        setCopiedGen(true);
        triggerToast('Password copied! Auto-scrubbing memory in 30s');
        triggerClipboardGuard('Generated Password');
        setTimeout(() => setCopiedGen(false), 2000);
      });
    }
  };

  const toggleReveal = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Favorite (Star) Status
  const handleToggleFavorite = async (item, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const newFav = !item.isFavorite;

    // Optimistic UI update
    setVaultItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isFavorite: newFav } : i))
    );

    try {
      if (cryptoKey) {
        const domain = item.url || resolveCompanyDomain(item.name);
        const { ciphertext, iv } = await encryptVaultSecret(item.password, cryptoKey);
        const extra = {
          notes: item.notes || '',
          totpSecret: item.totpSecret || '',
          history: Array.isArray(item.passwordHistory) ? item.passwordHistory : []
        };
        const encryptedNotes = await encryptVaultSecret(JSON.stringify(extra), cryptoKey);
        updateVaultItem(user.id, item.id, {
          name: item.name,
          username: item.username,
          encrypted_password: ciphertext,
          iv: iv,
          auth_tag: newFav ? 'fav' : 'none',
          category: item.category,
          strength: item.strength,
          notes_encrypted: encryptedNotes.ciphertext,
          notes_iv: encryptedNotes.iv,
          icon_type: domain,
          url: domain
        });
      }
      triggerToast(newFav ? `Starred ${item.name} as Favorite!` : `Removed ${item.name} from Favorites`);
    } catch (err) {
      console.error('Failed to update favorite status:', err);
    }
  };

  // Open Add Item Modal with pre-generated strong password
  const handleOpenAddModal = () => {
    if (isVaultLocked) {
      triggerToast('Please unlock your vault first');
      return;
    }
    setNewItemName('');
    setNewItemUrl('');
    setIsAddUrlCustomized(false);
    setNewItemUser(user.email || '');
    setNewItemPass(generateSecurePassword(16, true, true, true, true));
    setNewItemTotp('');
    setNewItemCategory('Logins');
    setNewItemNotes('');
    setNewItemIsFav(false);
    setPassCreationMode('generate');
    setShowNewItemPass(true);
    setIsAddModalOpen(true);
  };

  // Name input change with auto-domain suggestion
  const handleNewNameChange = (val) => {
    setNewItemName(val);
    if (!isAddUrlCustomized) {
      const detected = resolveCompanyDomain(val);
      if (detected && detected !== 'generic.com') {
        setNewItemUrl(`https://${detected}`);
      } else {
        setNewItemUrl('');
      }
    }
  };

  // ADD Item Handler
  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPass.trim()) return;

    setIsSaving(true);
    try {
      const plainPass = sanitizeTextInput(newItemPass.trim(), 500);
      const plainUser = sanitizeTextInput(newItemUser.trim() || user.email, 300);
      const itemName = sanitizeTextInput(newItemName.trim(), 200);
      const domain = sanitizeTextInput(newItemUrl.trim(), 500) || resolveCompanyDomain(itemName);
      const strength = calculateStrength(plainPass);

      if (!cryptoKey) {
        throw new Error('Vault is locked. Please unlock your vault first.');
      }

      // Zero-Knowledge: Encrypt client-side using AES-256-GCM
      const { ciphertext, iv } = await encryptVaultSecret(plainPass, cryptoKey);
      
      const extra = {
        notes: sanitizeTextInput(newItemNotes.trim(), 5000),
        totpSecret: sanitizeTextInput(newItemTotp.trim(), 200),
        history: []
      };
      const notesEnc = await encryptVaultSecret(JSON.stringify(extra), cryptoKey);
      const notesCiphertext = notesEnc.ciphertext;
      const notesIv = notesEnc.iv;

      // Save encrypted payload to client-side storage (zero-knowledge: never leaves browser)
      const inserted = addVaultItem(user.id, {
        name: itemName,
        username: plainUser,
        encrypted_password: ciphertext,
        iv: iv,
        auth_tag: newItemIsFav ? 'fav' : null,
        category: newItemCategory,
        strength: strength,
        notes_encrypted: notesCiphertext,
        notes_iv: notesIv,
        icon_type: domain,
        url: domain
      });

      const newItem = {
        id: inserted.id,
        name: itemName,
        username: plainUser,
        password: plainPass,
        notes: extra.notes,
        totpSecret: extra.totpSecret,
        passwordHistory: [],
        category: newItemCategory,
        strength: strength,
        url: domain,
        iconType: domain,
        isFavorite: newItemIsFav,
        createdAt: inserted.created_at || new Date().toISOString()
      };

      setVaultItems((prev) => [newItem, ...prev]);

      triggerToast(`Encrypted & stored ${itemName} safely!`);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error saving item:', err);
      triggerToast('Error saving: ' + (err.message || 'Check connection'));
    } finally {
      setIsSaving(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemUrl(item.url || '');
    setEditItemUser(item.username);
    setEditItemPass(item.password);
    setNewItemTotpEdit(item.totpSecret || '');
    setEditItemHistory(Array.isArray(item.passwordHistory) ? item.passwordHistory : []);
    setEditItemCategory(item.category || 'Logins');
    setEditItemNotes(item.notes || '');
    setEditItemIsFav(Boolean(item.isFavorite));
    setEditPassCreationMode('custom');
    setShowEditItemPass(false);
    setIsEditModalOpen(true);
  };

  // SAVE EDIT Item Handler
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editItemName.trim() || !editItemPass.trim()) return;

    setIsSaving(true);
    try {
      const plainPass = sanitizeTextInput(editItemPass.trim(), 500);
      const plainUser = sanitizeTextInput(editItemUser.trim() || user.email, 300);
      const itemName = sanitizeTextInput(editItemName.trim(), 200);
      const domain = sanitizeTextInput(editItemUrl.trim(), 500) || resolveCompanyDomain(itemName);
      const strength = calculateStrength(plainPass);

      if (!cryptoKey) {
        throw new Error('Vault is locked. Please unlock to save changes.');
      }

      // Re-encrypt updated password client-side
      const { ciphertext, iv } = await encryptVaultSecret(plainPass, cryptoKey);

      // Track password history if password changed
      const originalItem = vaultItems.find((i) => i.id === editingItemId);
      const history = Array.isArray(editItemHistory) ? [...editItemHistory] : [];
      if (
        originalItem &&
        originalItem.password &&
        originalItem.password !== plainPass &&
        originalItem.password !== '••••••••••••'
      ) {
        history.unshift({
          password: originalItem.password,
          changedAt: new Date().toISOString()
        });
      }

      const extra = {
        notes: editItemNotes.trim(),
        totpSecret: editItemTotp.trim(),
        history
      };
      const notesEnc = await encryptVaultSecret(JSON.stringify(extra), cryptoKey);
      const notesCiphertext = notesEnc.ciphertext;
      const notesIv = notesEnc.iv;

      updateVaultItem(user.id, editingItemId, {
        name: itemName,
        username: plainUser,
        encrypted_password: ciphertext,
        iv: iv,
        auth_tag: editItemIsFav ? 'fav' : 'none',
        category: editItemCategory,
        strength: strength,
        notes_encrypted: notesCiphertext,
        notes_iv: notesIv,
        icon_type: domain,
        url: domain
      });

      // Update state
      setVaultItems((prev) =>
        prev.map((i) =>
          i.id === editingItemId
            ? {
                ...i,
                name: itemName,
                username: plainUser,
                password: plainPass,
                notes: editItemNotes.trim(),
                totpSecret: editItemTotp.trim(),
                passwordHistory: history,
                category: editItemCategory,
                strength: strength,
                url: domain,
                iconType: domain,
                isFavorite: editItemIsFav
              }
            : i
        )
      );

      triggerToast(`Updated ${itemName} securely!`);
      setIsEditModalOpen(false);
      setEditingItemId(null);
    } catch (err) {
      console.error('Error updating item:', err);
      triggerToast('Error updating: ' + (err.message || 'Check connection'));
    } finally {
      setIsSaving(false);
    }
  };

  // Chrome & Generic Password CSV / JSON Import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (!text || typeof text !== 'string') throw new Error('File is empty');

        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          const list = Array.isArray(json.items) ? json.items : Array.isArray(json) ? json : [];
          const allowedCategories = ['Logins', 'Work', 'Entertainment', 'Productivity', 'Shopping', 'Finance', 'Other'];
          const formatted = list
            .map((item, idx) => {
              const password = item.password || item.login?.password || item.login_password || '';
              const url = item.url || item.login?.uris?.[0]?.uri || item.login_uri || '';
              const username = item.username || item.login?.username || item.login_username || '';
              const notes = item.notes || item.note || '';
              const rawTotp = item.totpSecret || item.login?.totp || item.login_totp || '';
              const cleanTotp = extractTOTPSecret(rawTotp);
              const rawCategory = (item.category || item.folder || '').trim();
              const matchedCategory = allowedCategories.find((c) => c.toLowerCase() === rawCategory.toLowerCase()) || 'Logins';
              const name = item.name || item.title || (url ? resolveCompanyDomain(url) : `Imported Account ${idx + 1}`);

              return {
                id: `imp_${idx}_${Date.now()}`,
                name,
                url,
                username,
                password,
                notes,
                totpSecret: cleanTotp,
                category: matchedCategory,
                strength: calculateStrength(password),
                selected: true
              };
            })
            .filter((i) => Boolean(i.password));
          setImportParsedItems(formatted);
          triggerToast(`Discovered ${formatted.length} accounts ready to import!`);
        } else {
          const parsed = parseChromeOrGenericCSV(text);
          setImportParsedItems(parsed);
          triggerToast(`Discovered ${parsed.length} passwords from Chrome CSV!`);
        }
      } catch (err) {
        console.error('Import file parse error:', err);
        triggerToast('Failed to parse file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!cryptoKey) {
      triggerToast('Please unlock your vault before importing.');
      return;
    }
    const selectedItems = importParsedItems.filter((i) => i.selected);
    if (selectedItems.length === 0) {
      triggerToast('Please select at least one account to import.');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    let importedCount = 0;
    const newlyAdded = [];

    for (let idx = 0; idx < selectedItems.length; idx++) {
      const raw = selectedItems[idx];
      try {
        const domain = raw.url || resolveCompanyDomain(raw.name);
        const { ciphertext, iv } = await encryptVaultSecret(raw.password, cryptoKey);

        const extra = {
          notes: raw.notes || '',
          totpSecret: raw.totpSecret || '',
          history: []
        };
        const encNotes = await encryptVaultSecret(JSON.stringify(extra), cryptoKey);

        const savedItem = addVaultItem(user.id, {
          name: raw.name,
          username: raw.username,
          encrypted_password: ciphertext,
          iv: iv,
          auth_tag: null,
          category: raw.category || 'Logins',
          strength: raw.strength || calculateStrength(raw.password),
          notes_encrypted: encNotes.ciphertext,
          notes_iv: encNotes.iv,
          icon_type: domain,
          url: domain
        });

        newlyAdded.push({
          id: savedItem.id,
          name: raw.name,
          username: raw.username,
          password: raw.password,
          notes: raw.notes || '',
          totpSecret: raw.totpSecret || '',
          passwordHistory: [],
          category: raw.category || 'Logins',
          strength: raw.strength || calculateStrength(raw.password),
          url: domain,
          iconType: domain,
          isFavorite: false,
          createdAt: savedItem.created_at || new Date().toISOString()
        });
        importedCount++;
      } catch (e) {
        console.warn('Failed to import item', raw.name, e);
      }
      setImportProgress(Math.round(((idx + 1) / selectedItems.length) * 100));
    }

    setVaultItems((prev) => [...newlyAdded, ...prev]);
    setIsImporting(false);
    setIsImportModalOpen(false);
    setImportParsedItems([]);
    triggerToast(`Successfully encrypted & imported ${importedCount} passwords!`);
  };

  // 1-Click Upgrade for Weak/Reused Password
  const handleOneClickUpgrade = async (item) => {
    if (!cryptoKey) {
      triggerToast('Please unlock your vault first.');
      return;
    }
    const newStrongPass = generateSecurePassword(20, true, true, true, true, false);
    try {
      setIsSaving(true);
      const domain = item.url || resolveCompanyDomain(item.name);
      const { ciphertext, iv } = await encryptVaultSecret(newStrongPass, cryptoKey);

      const history = Array.isArray(item.passwordHistory) ? [...item.passwordHistory] : [];
      if (item.password && item.password !== '••••••••••••') {
        history.unshift({
          password: item.password,
          changedAt: new Date().toISOString()
        });
      }

      const extra = {
        notes: item.notes || '',
        totpSecret: item.totpSecret || '',
        history
      };
      const encNotes = await encryptVaultSecret(JSON.stringify(extra), cryptoKey);

      updateVaultItem(user.id, item.id, {
        name: item.name,
        username: item.username,
        encrypted_password: ciphertext,
        iv: iv,
        auth_tag: item.isFavorite ? 'fav' : 'none',
        category: item.category,
        strength: 'Strong',
        notes_encrypted: encNotes.ciphertext,
        notes_iv: encNotes.iv,
        icon_type: domain,
        url: domain
      });

      setVaultItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                password: newStrongPass,
                strength: 'Strong',
                passwordHistory: history
              }
            : i
        )
      );

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(newStrongPass);
        triggerClipboardGuard('Password');
      }
      triggerToast(`Upgraded ${item.name} to 20-char high entropy password! (Copied to clipboard)`);
    } catch (err) {
      console.error('Upgrade error:', err);
      triggerToast('Upgrade failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Print Emergency Vault Recovery Sheet
  const handlePrintEmergencyKit = () => {
    const win = window.open('', '_blank');
    if (!win) {
      triggerToast('Please allow popups to generate Emergency Sheet');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>VaultSyncc Emergency Access Kit</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #000; line-height: 1.5; }
            .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 26px; font-weight: 900; margin: 0; }
            .subtitle { font-size: 14px; color: #475569; margin-top: 4px; }
            .alert-box { background: #FAF7EE; border: 2px solid #000; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; }
            .pass-box { border: 2.5px dashed #000; border-radius: 10px; padding: 24px; text-align: center; margin: 30px 0; background: #FFF; }
            .pass-box-lbl { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin-bottom: 8px; }
            .pass-line { font-size: 18px; font-weight: 700; min-height: 30px; letter-spacing: 2px; }
            .section { margin-bottom: 24px; }
            .section h3 { font-size: 16px; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 6px; margin-bottom: 10px; }
            .footer { margin-top: 40px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">VaultSync — Emergency Access Sheet</h1>
              <div class="subtitle">Zero-Knowledge Encrypted Password Vault Record</div>
            </div>
            <div style="font-weight: 900; font-size: 18px; border: 2px solid #000; padding: 6px 14px; border-radius: 6px; background: #B5F2B7;">
              CONFIDENTIAL
            </div>
          </div>

          <div class="alert-box">
            <strong>CRITICAL SECURITY NOTICE:</strong>
            VaultSyncc uses client-side AES-256-GCM encryption with PBKDF2 (100,000 rounds). VaultSyncc servers DO NOT hold your Master Password and CANNOT decrypt or recover your vault without it. Store this paper copy securely in a physical safe.
          </div>

          <div class="section">
            <h3>Account Details</h3>
            <p><strong>Account Holder:</strong> ${user.name} (${user.email})</p>
            <p><strong>Vault Credentials:</strong> ${vaultItems.length} Accounts Stored</p>
            <p><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Encryption Standard:</strong> AES-256-GCM Zero-Knowledge</p>
          </div>

          <div class="pass-box">
            <div class="pass-box-lbl">Write Your Master Password Below (Never Store Online)</div>
            <div class="pass-line">____________________________________________________________</div>
          </div>

          <div class="section">
            <h3>Recovery Instructions</h3>
            <ol style="padding-left: 20px;">
              <li>Visit <strong>${window.location.origin}/dashboard</strong> on any computer or mobile browser.</li>
              <li>Sign in using your account email: <strong>${user.email}</strong>.</li>
              <li>When prompted, enter your handwritten Master Password above.</li>
              <li>Your vault credentials will immediately decrypt in the browser.</li>
            </ol>
          </div>

          <div class="footer">
            VaultSyncc Zero-Knowledge Architecture • Store in a safe offline location.
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();
  };

  // DELETE Item Handler
  const handleDeleteItem = async (item, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!confirm(`Are you sure you want to permanently delete "${item.name}" from your vault?`)) return;

    try {
      deleteVaultItem(user.id, item.id);
      setVaultItems((prev) => prev.filter((i) => i.id !== item.id));
      triggerToast(`Deleted ${item.name} from vault.`);
    } catch (err) {
      console.error('Failed to delete item:', err);
      triggerToast('Error deleting item: ' + err.message);
    }
  };

  // Export Encrypted JSON Backup
  const handleExportBackup = (includePlaintext = false) => {
    try {
      if (includePlaintext && (isVaultLocked || !cryptoKey)) {
        triggerToast('Please unlock your vault before exporting decrypted credentials.');
        return;
      }

      const dataToExport = {
        exportedAt: new Date().toISOString(),
        user: user.email,
        vaultVersion: '2.0-ZeroKnowledge',
        totalItems: vaultItems.length,
        items: includePlaintext
          ? vaultItems.map((item) => ({
              id: item.id,
              name: item.name,
              url: item.url,
              username: item.username,
              password: item.password,
              notes: item.notes || '',
              totpSecret: item.totpSecret || '',
              category: item.category,
              strength: item.strength,
              isFavorite: Boolean(item.isFavorite),
              createdAt: item.createdAt
            }))
          : vaultItems.map((item) => ({
              id: item.id,
              name: item.name,
              url: item.url,
              username: item.username,
              category: item.category,
              createdAt: item.createdAt
            }))
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vaultsync_${includePlaintext ? 'full_backup' : 'metadata_backup'}_${user.email.split('@')[0]}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExportModalOpen(false);
      triggerToast('Vault backup file downloaded!');
    } catch (e) {
      triggerToast('Export failed: ' + e.message);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mypass_user');
        if (user.id) {
          sessionStorage.removeItem('vaultsync_active_key_' + user.id);
        }
      }
      setCryptoKey(null);
      await signOut({ redirectUrl: '/' });
      router.replace('/');
    } catch (err) {
      console.error('Sign out error:', err);
      window.location.href = '/';
    }
  };

  // Change Master Password & Re-Encrypt Vault
  const handleChangeMasterPassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setChangePassError('');

    if (!newMasterPass || newMasterPass.length < 8) {
      setChangePassError('New master password must be at least 8 characters long.');
      return;
    }
    if (newMasterPass !== confirmMasterPass) {
      setChangePassError('Passwords do not match. Please verify.');
      return;
    }
    if (!cryptoKey) {
      setChangePassError('Vault is locked. Please unlock first.');
      return;
    }

    try {
      setIsChangingPass(true);
      const newKey = await deriveMasterKey(newMasterPass, user.email || 'user');

      // 1. Establish new cryptographic canary verifier
      const canary = await encryptVaultSecret('VAULTSYNC_KEY_VERIFIED', newKey);
      saveVerifier(user.id, canary.ciphertext, canary.iv);
      setStoredVerifier(canary.ciphertext);
      setStoredVerifierIv(canary.iv);

      // 2. Re-encrypt all existing items in state with new key and update database
      for (const item of vaultItems) {
        const { ciphertext, iv } = await encryptVaultSecret(item.password, newKey);
        const extra = {
          notes: item.notes || '',
          totpSecret: item.totpSecret || '',
          history: Array.isArray(item.passwordHistory) ? item.passwordHistory : []
        };
        const encNotes = await encryptVaultSecret(JSON.stringify(extra), newKey);
        const domain = item.url || resolveCompanyDomain(item.name);

        updateVaultItem(user.id, item.id, {
          name: item.name,
          username: item.username,
          encrypted_password: ciphertext,
          iv: iv,
          auth_tag: item.isFavorite ? 'fav' : 'none',
          category: item.category,
          strength: item.strength,
          notes_encrypted: encNotes.ciphertext,
          notes_iv: encNotes.iv,
          icon_type: domain,
          url: domain
        });
      }

      // 3. Cache new session key in sessionStorage
      if (typeof window !== 'undefined' && user.id) {
        try {
          const exported = await exportRawKey(newKey);
          if (exported) {
            sessionStorage.setItem('vaultsync_active_key_' + user.id, exported);
          }
        } catch (e) {
          console.warn('Session key update error:', e);
        }
      }

      setCryptoKey(newKey);
      setNewMasterPass('');
      setConfirmMasterPass('');
      setIsSettingsModalOpen(false);
      triggerToast('Master password changed and all credentials re-encrypted!');
    } catch (err) {
      console.error('Failed to change master password:', err);
      setChangePassError('Failed to change master password: ' + err.message);
    } finally {
      setIsChangingPass(false);
    }
  };

  // Clear offline cache
  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mypass_vault_items');
      triggerToast('Local cache cleared! Refreshing from cloud database...');
      if (cryptoKey) {
        loadVaultData(cryptoKey, user.id);
      }
    }
  };

  // Auto-lock setting updater
  const handleSaveAutoLock = (mins) => {
    setAutoLockMinutes(mins);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mypass_autolock_minutes', String(mins));
    }
    triggerToast(`Auto-lock set to ${mins === 0 ? 'Never' : `${mins} minutes`}`);
  };

  // Auto-lock effect based on inactivity
  useEffect(() => {
    if (!autoLockMinutes || autoLockMinutes <= 0 || isVaultLocked || !cryptoKey) return;

    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLockVault();
        triggerToast('Vault auto-locked due to inactivity.');
      }, autoLockMinutes * 60 * 1000);
    };

    resetTimer();
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));

    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [autoLockMinutes, isVaultLocked, cryptoKey, triggerToast, handleLockVault]);

  // Security Audit & Health Metrics
  const auditMetrics = useMemo(() => {
    if (vaultItems.length === 0) {
      return {
        score: 100,
        strong: 0,
        moderate: 0,
        weak: 0,
        reused: 0,
        favorites: 0,
        weakItems: [],
        reusedClusters: [],
        missing2fa: [],
        staleItems: []
      };
    }

    let strong = 0;
    let moderate = 0;
    let weak = 0;
    const passCountMap = {};
    const passToItems = {};
    const weakItems = [];
    const missing2fa = [];
    const staleItems = [];
    const nowMs = Date.now();

    vaultItems.forEach((item) => {
      const st = item.strength || calculateStrength(item.password);
      if (st === 'Strong') strong++;
      else if (st === 'Moderate') {
        moderate++;
        weakItems.push(item);
      } else {
        weak++;
        weakItems.push(item);
      }

      if (item.password && item.password !== '••••••••••••') {
        passCountMap[item.password] = (passCountMap[item.password] || 0) + 1;
        passToItems[item.password] = passToItems[item.password] || [];
        passToItems[item.password].push(item);
      }

      if (!item.totpSecret) {
        missing2fa.push(item);
      }

      const ageDays = (nowMs - new Date(item.createdAt || 0).getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays > 90) {
        staleItems.push(item);
      }
    });

    let reused = 0;
    const reusedClusters = [];
    Object.entries(passToItems).forEach(([pass, itemsList]) => {
      if (itemsList.length > 1) {
        reused += itemsList.length;
        reusedClusters.push({ password: pass, items: itemsList, count: itemsList.length });
      }
    });

    const favorites = vaultItems.filter((i) => i.isFavorite).length;
    const evaluatedTotal = vaultItems.length || 1;
    const score = Math.min(
      100,
      Math.max(
        0,
        Math.round(((strong * 100) + (moderate * 50) - (reused * 15) - (weak * 25)) / evaluatedTotal)
      )
    );

    return {
      score,
      strong,
      moderate,
      weak,
      reused,
      favorites,
      weakItems,
      reusedClusters,
      missing2fa,
      staleItems
    };
  }, [vaultItems]);

  // Filtered & Sorted Vault Items
  const filteredAndSortedItems = useMemo(() => {
    let result = vaultItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (activeCategory === 'All') return true;
      if (activeCategory === 'Favorites') return Boolean(item.isFavorite);
      if (activeCategory === 'At-Risk') return item.strength === 'Weak' || item.strength === 'Moderate';
      return item.category.toLowerCase() === activeCategory.toLowerCase();
    });

    // Sort items
    result.sort((a, b) => {
      // Pinned favorites always stay on top
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'strength') {
        const order = { Weak: 1, Moderate: 2, Strong: 3 };
        return (order[a.strength] || 0) - (order[b.strength] || 0);
      }
      // 'newest' default
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [vaultItems, searchQuery, activeCategory, sortBy]);

  // Loading Screen while Clerk or Vault initializes
  if (!isLoaded || (isSignedIn && isCheckingVaultStatus)) {
    return (
      <div className="vault-dashboard-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F6F0' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="vault-spinner" style={{ width: 44, height: 44, margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 700, color: '#000000', fontSize: '1.05rem' }}>Verifying Zero-Knowledge Session...</p>
        </div>
      </div>
    );
  }

  // Graceful Authenticated Gate
  if (!isSignedIn) {
    return (
      <div className="vault-dashboard-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F6F0' }}>
        <div style={{ textAlign: 'center', maxWidth: 420, padding: 36, background: '#FFFFFF', border: '2.5px solid #000000', borderRadius: 24, boxShadow: '4px 4px 0 #000000' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <VaultSyncLogoIcon size={56} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: 8, color: '#000' }}>Authentication Required</h2>
          <p style={{ color: '#475569', fontSize: '0.90rem', marginBottom: 24, lineHeight: 1.5 }}>
            Please sign in to access your encrypted passwords and credentials.
          </p>
          <Link href="/sign-in" className="vault-btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%', textDecoration: 'none' }}>
            Sign In with VaultSyncc &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-dashboard-wrapper">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="vault-toast-banner">
          <CheckCircle2 size={18} color="#B5F2B7" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="vault-navbar">
        <div className="vault-nav-brand-group">
          <VaultSyncLogo size={32} fontSize="1.25rem" href="/" />
        </div>

        {/* Global Instant Search */}
        <div className="vault-search-container">
          <div className="vault-search-input-box">
            <Search size={16} className="vault-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search passwords, sites, usernames... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="vault-search-input"
              suppressHydrationWarning
            />
            {searchQuery ? (
              <button className="vault-search-clear" onClick={() => setSearchQuery('')} title="Clear search" suppressHydrationWarning>
                <X size={14} />
              </button>
            ) : (
              <span className="vault-search-kbd">Ctrl+K</span>
            )}
          </div>
        </div>

        {/* Top Action Toolbar */}
        <div className="vault-nav-actions">
          <button className="vault-btn-primary" onClick={handleOpenAddModal} title="Add New Item" aria-label="Add Item">
            <Plus size={16} />
            <span>Add Item</span>
          </button>

          <button
            className="vault-btn-ghost"
            onClick={() => setIsImportModalOpen(true)}
            title="Import passwords from Google Chrome CSV or JSON"
            aria-label="Import passwords"
          >
            <Upload size={16} />
            <span>Import</span>
          </button>

          <button
            className="vault-btn-ghost"
            onClick={() => setIsGeneratorModalOpen(true)}
            title="Open Password Generator"
            aria-label="Password Generator"
          >
            <Sliders size={16} />
            <span>Generator</span>
          </button>

          <button
            className="vault-btn-ghost"
            onClick={() => setIsExportModalOpen(true)}
            title="Export Encrypted Backup"
            aria-label="Export Backup"
          >
            <Download size={16} />
            <span>Backup</span>
          </button>

          <button
            className="vault-btn-ghost"
            onClick={() => setIsSettingsModalOpen(true)}
            title="Vault Settings & Preferences"
            aria-label="Settings"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button
            className="vault-btn-ghost"
            onClick={handleLockVault}
            title="Lock Vault Instantly (Ctrl+L)"
            aria-label="Lock Vault"
          >
            <Lock size={16} />
            <span>Lock</span>
          </button>

          <button
            className="vault-btn-logout"
            onClick={handleSignOut}
            title="Sign Out of VaultSyncc"
            aria-label="Log Out"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          {/* User Profile Avatar & Clerk Sign-Out */}
          <div className="vault-user-avatar-chip">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div className="vault-user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="vault-user-email-text">{user.name || user.email}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* MAIN VAULT BODY */}
      <main className="vault-main-container">
        {/* LANDING-PAGE STYLE HERO WELCOME BANNER */}
        <section className="vault-hero-welcome">
          <div className="vault-hero-welcome-left">
            <div className="vault-hero-badge">
              <span>Zero-Knowledge Active</span>
              <span style={{ fontWeight: 900 }}>#1</span>
            </div>
            <h1 className="vault-hero-title">
              Password Management<br />
              from Anywhere
            </h1>
            <p className="vault-hero-subtext">
              Welcome back, <strong>{user.name}</strong>. Your digital life is protected with client-side
              AES-256-GCM encryption and zero-knowledge architecture.
            </p>
            <div className="vault-hero-cta-group">
              <button className="btn-pill-black" onClick={handleOpenAddModal}>
                Add Credential <span style={{ marginLeft: 4 }}>&rarr;</span>
              </button>
              <button className="btn-pill-white" onClick={() => setIsImportModalOpen(true)}>
                <Upload size={14} style={{ marginRight: 6 }} />
                Import from Chrome
              </button>
              <button className="btn-pill-white" onClick={() => setActiveCategory('Security Health')}>
                <ShieldCheck size={14} style={{ marginRight: 6, color: '#16A34A' }} />
                Health Audit ({auditMetrics.score}%)
              </button>
              <button className="btn-pill-white" onClick={handlePrintEmergencyKit}>
                <Printer size={14} style={{ marginRight: 6 }} />
                Emergency Sheet
              </button>
            </div>
          </div>
        </section>

        {/* METRICS & HEALTH STRIP */}
        <section className="vault-metrics-grid">
          {/* Card 1: Total Credentials */}
          <div
            className={`vault-metric-card ${activeCategory === 'All' ? 'active-filter' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            <div className="vault-metric-icon" style={{ background: '#B5F2B7', color: '#000000' }}>
              <Key size={22} />
            </div>
            <div className="vault-metric-info">
              <span className="vault-metric-value">{vaultItems.length}</span>
              <span className="vault-metric-label">Total Credentials</span>
            </div>
          </div>

          {/* Card 2: Vault Health Score */}
          <div
            className={`vault-metric-card ${activeCategory === 'Security Health' ? 'active-filter' : ''}`}
            onClick={() => setActiveCategory('Security Health')}
            title="Click to view detailed Security Health Command Center"
          >
            <div
              className="vault-metric-icon"
              style={{
                background: auditMetrics.score >= 80 ? '#DCFCE7' : '#FEF3C7',
                color: auditMetrics.score >= 80 ? '#15803D' : '#D97706'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div className="vault-metric-info">
              <span className="vault-metric-value" style={{ color: auditMetrics.score >= 80 ? '#15803D' : '#D97706' }}>
                {auditMetrics.score}%
              </span>
              <span className="vault-metric-label">Vault Health</span>
            </div>
          </div>

          {/* Card 3: Strong Passwords */}
          <div className="vault-metric-card" onClick={() => setActiveCategory('All')}>
            <div className="vault-metric-icon" style={{ background: '#B5F2B7', color: '#000000' }}>
              <Zap size={22} fill="#000000" />
            </div>
            <div className="vault-metric-info">
              <span className="vault-metric-value">{auditMetrics.strong}</span>
              <span className="vault-metric-label">High Entropy</span>
            </div>
          </div>

          {/* Card 4: At-Risk / Weak Passwords (Interactive Filter) */}
          <div
            className={`vault-metric-card ${activeCategory === 'At-Risk' ? 'active-filter' : ''}`}
            onClick={() => setActiveCategory('At-Risk')}
            title="Click to filter weak or moderate passwords"
          >
            <div
              className="vault-metric-icon"
              style={{
                background: auditMetrics.weak > 0 ? '#FEE2E2' : '#F1F5F9',
                color: auditMetrics.weak > 0 ? '#DC2626' : '#64748B'
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div className="vault-metric-info">
              <span className="vault-metric-value" style={{ color: auditMetrics.weak > 0 ? '#DC2626' : '#000000' }}>
                {auditMetrics.weak + auditMetrics.moderate}
              </span>
              <span className="vault-metric-label">Needs Attention</span>
            </div>
          </div>

          {/* Card 5: Starred Favorites */}
          <div
            className={`vault-metric-card ${activeCategory === 'Favorites' ? 'active-filter' : ''}`}
            onClick={() => setActiveCategory('Favorites')}
            title="Click to filter favorite passwords"
          >
            <div className="vault-metric-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <Star size={22} />
            </div>
            <div className="vault-metric-info">
              <span className="vault-metric-value">{auditMetrics.favorites}</span>
              <span className="vault-metric-label">Starred Items</span>
            </div>
          </div>
        </section>

        {/* CONTROLS BAR: CATEGORIES, SORTING, AND VIEW TOGGLE */}
        <section className="vault-controls-bar">
          {/* Row 1: Category Filter Chips */}
          <div className="vault-category-filter-row">
            <div className="vault-category-tabs" role="tablist" aria-label="Credential category filters">
              {[
                { id: 'All', label: 'All', icon: <Layers size={14} strokeWidth={2.4} /> },
                { id: 'Favorites', label: 'Favorites', icon: <Star size={14} strokeWidth={2.4} /> },
                { id: 'Security Health', label: 'Health Audit', icon: <ShieldAlert size={14} strokeWidth={2.4} /> },
                { id: 'Logins', label: 'Logins', icon: <Key size={14} strokeWidth={2.4} /> },
                { id: 'Work', label: 'Work', icon: <Briefcase size={14} strokeWidth={2.4} /> },
                { id: 'Finance', label: 'Finance', icon: <CreditCard size={14} strokeWidth={2.4} /> },
                { id: 'Productivity', label: 'Productivity', icon: <Zap size={14} strokeWidth={2.4} /> },
                { id: 'Entertainment', label: 'Entertainment', icon: <Film size={14} strokeWidth={2.4} /> },
                { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={14} strokeWidth={2.4} /> },
                { id: 'Other', label: 'Other', icon: <Folder size={14} strokeWidth={2.4} /> }
              ].map(({ id: cat, label, icon }) => {
                const count =
                  cat === 'All'
                    ? vaultItems.length
                    : cat === 'Favorites'
                    ? vaultItems.filter((i) => i.isFavorite).length
                    : cat === 'Security Health'
                    ? (auditMetrics.weak + auditMetrics.reused)
                    : vaultItems.filter((i) => i.category.toLowerCase() === cat.toLowerCase()).length;

                const isActive = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`vault-cat-tab ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span className="vault-cat-icon">{icon}</span>
                    <span>{label}</span>
                    <span
                      className="vault-cat-badge"
                      style={
                        cat === 'Security Health' && count > 0
                          ? { background: '#FEE2E2', color: '#DC2626', borderColor: '#F87171' }
                          : {}
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Secondary Toolbar (Filter Status & Summary on Left, Sort + View Mode on Right) */}
          <div className="vault-secondary-toolbar">
            <div className="vault-toolbar-status">
              <span className="vault-status-indicator" aria-hidden="true" />
              <span className="vault-status-text">
                {activeCategory === 'All' ? (
                  <>Showing <strong>{vaultItems.length}</strong> credentials</>
                ) : (
                  <>Filtered by <strong>{activeCategory === 'Security Health' ? 'Health Audit' : activeCategory}</strong> ({
                    activeCategory === 'Favorites'
                      ? vaultItems.filter((i) => i.isFavorite).length
                      : activeCategory === 'Security Health'
                      ? (auditMetrics.weak + auditMetrics.reused)
                      : vaultItems.filter((i) => i.category.toLowerCase() === activeCategory.toLowerCase()).length
                  })</>
                )}
              </span>
              {activeCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="vault-clear-filter-btn"
                  title="Reset filter to All"
                  aria-label="Clear active filter"
                >
                  Clear filter &times;
                </button>
              )}
            </div>

            <div className="vault-view-controls">
              {/* Sort Selector */}
              <div className="vault-sort-wrapper">
                <span className="vault-sort-label">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="vault-select-sort"
                  aria-label="Sort credentials"
                >
                  <option value="newest">Recently Added</option>
                  <option value="name">Name (A — Z)</option>
                  <option value="strength">Security Health</option>
                </select>
              </div>

              {/* Grid vs List View Switcher */}
              <div className="vault-view-switcher" role="group" aria-label="View layout switcher">
                <button
                  type="button"
                  className={`vault-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => handleSetViewMode('grid')}
                  title="Grid View"
                  aria-label="Switch to grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`vault-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => handleSetViewMode('list')}
                  title="Compact List View"
                  aria-label="Switch to compact list view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* VAULT ITEMS DISPLAY */}
        {isLoadingVault ? (
          <div className="vault-empty-state">
            <div className="vault-spinner" style={{ width: 44, height: 44 }} />
            <h3>Decrypting Vault Secrets...</h3>
            <p>Performing local client-side AES-256-GCM verification.</p>
          </div>
        ) : activeCategory === 'Security Health' ? (
          /* SECURITY HEALTH COMMAND CENTER */
          <div className="vault-security-health-view">
            {/* Hero Card */}
            <div className="vault-health-hero-card">
              <div className="vault-health-hero-left">
                <div
                  className="vault-health-score-ring"
                  style={{
                    background:
                      auditMetrics.score >= 80
                        ? '#DCFCE7'
                        : auditMetrics.score >= 50
                        ? '#FEF3C7'
                        : '#FEE2E2',
                    borderColor:
                      auditMetrics.score >= 80
                        ? '#15803D'
                        : auditMetrics.score >= 50
                        ? '#D97706'
                        : '#DC2626'
                  }}
                >
                  <span
                    className="vault-health-score-num"
                    style={{
                      color:
                        auditMetrics.score >= 80
                          ? '#15803D'
                          : auditMetrics.score >= 50
                          ? '#D97706'
                          : '#DC2626'
                    }}
                  >
                    {auditMetrics.score}%
                  </span>
                  <span
                    className="vault-health-score-lbl"
                    style={{
                      color:
                        auditMetrics.score >= 80
                          ? '#15803D'
                          : auditMetrics.score >= 50
                          ? '#D97706'
                          : '#DC2626'
                    }}
                  >
                    {auditMetrics.score >= 80
                      ? 'FORTIFIED'
                      : auditMetrics.score >= 50
                      ? 'MODERATE'
                      : 'AT RISK'}
                  </span>
                </div>
                <div className="vault-health-hero-text">
                  <h2>Security Health Command Center</h2>
                  <p>
                    Continuous local audit of your zero-knowledge encrypted vault. Unlike Google Chrome,
                    VaultSyncc identifies reused clusters, missing two-factor authentication, and enables
                    instant 1-click upgrades to 20-character high-entropy keys.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="vault-btn-primary" onClick={handlePrintEmergencyKit}>
                  <Printer size={16} />
                  <span>Print Offline Recovery Kit</span>
                </button>
                <button
                  className="vault-btn-ghost"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload size={16} />
                  <span>Import More Passwords</span>
                </button>
              </div>
            </div>

            {/* Audit Sections Grid */}
            <div className="vault-audit-sections-grid">
              {/* Box 1: Weak & Vulnerable Passwords */}
              <div className="vault-audit-box">
                <div className="vault-audit-box-header">
                  <div className="vault-audit-box-title">
                    <AlertTriangle size={18} color="#DC2626" />
                    <span>Weak Passwords ({auditMetrics.weakItems?.length || 0})</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: auditMetrics.weakItems?.length ? '#DC2626' : '#16A34A',
                      background: auditMetrics.weakItems?.length ? '#FEE2E2' : '#DCFCE7',
                      padding: '3px 8px',
                      borderRadius: 12
                    }}
                  >
                    {auditMetrics.weakItems?.length ? 'Action Required' : 'All Strong'}
                  </span>
                </div>

                {auditMetrics.weakItems?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: '#16A34A' }}>
                    <ShieldCheck size={32} style={{ margin: '0 auto 8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.90rem' }}>Zero Weak Passwords Found!</strong>
                    <span style={{ fontSize: '0.80rem', color: '#64748B' }}>
                      All credentials meet high-entropy cryptographic standards.
                    </span>
                  </div>
                ) : (
                  <div>
                    {auditMetrics.weakItems.map((item) => (
                      <div key={item.id} className="vault-audit-item-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <CompanyLogo name={item.name} url={item.url} size={28} />
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: '0.88rem', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </strong>
                            <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                              {item.username || 'No username'} • {calculateEntropy(item.password)} bits
                            </span>
                          </div>
                        </div>

                        <button
                          className="vault-audit-upgrade-btn"
                          onClick={() => handleOneClickUpgrade(item)}
                          disabled={isSaving}
                          title="Generate 20-char high entropy password, re-encrypt, and copy"
                        >
                          <Zap size={13} fill="#000000" />
                          <span>1-Click Upgrade</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Box 2: Reused Password Vulnerabilities */}
              <div className="vault-audit-box">
                <div className="vault-audit-box-header">
                  <div className="vault-audit-box-title">
                    <Key size={18} color="#D97706" />
                    <span>Reused Passwords ({auditMetrics.reused} reuse events)</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: auditMetrics.reused > 0 ? '#D97706' : '#16A34A',
                      background: auditMetrics.reused > 0 ? '#FEF3C7' : '#DCFCE7',
                      padding: '3px 8px',
                      borderRadius: 12
                    }}
                  >
                    {auditMetrics.reused > 0 ? 'Credential Stuffing Risk' : 'All Unique'}
                  </span>
                </div>

                {auditMetrics.reusedClusters?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: '#16A34A' }}>
                    <ShieldCheck size={32} style={{ margin: '0 auto 8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.90rem' }}>No Reused Passwords!</strong>
                    <span style={{ fontSize: '0.80rem', color: '#64748B' }}>
                      Every single account in your vault uses a completely unique password.
                    </span>
                  </div>
                ) : (
                  <div>
                    {auditMetrics.reusedClusters.map((cluster, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          background: '#FFFBEB',
                          border: '1.5px solid #FCD34D',
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 10
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400E', marginBottom: 8 }}>
                          Shared by {cluster.count} accounts:
                        </div>
                        {cluster.items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '4px 0',
                              borderBottom: '1px dashed #FDE68A'
                            }}
                          >
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#000000' }}>
                              {item.name} ({item.username})
                            </span>
                            <button
                              className="vault-audit-upgrade-btn"
                              onClick={() => handleOneClickUpgrade(item)}
                              disabled={isSaving}
                            >
                              <Zap size={12} fill="#000000" />
                              <span>Make Unique</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Box 3: Accounts Missing 2FA / TOTP */}
              <div className="vault-audit-box">
                <div className="vault-audit-box-header">
                  <div className="vault-audit-box-title">
                    <Shield size={18} color="#2563EB" />
                    <span>Missing 2FA / TOTP ({auditMetrics.missing2fa?.length || 0})</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: auditMetrics.missing2fa?.length ? '#2563EB' : '#16A34A',
                      background: auditMetrics.missing2fa?.length ? '#DBEAFE' : '#DCFCE7',
                      padding: '3px 8px',
                      borderRadius: 12
                    }}
                  >
                    {auditMetrics.missing2fa?.length ? 'Recommended' : 'All Protected'}
                  </span>
                </div>

                {auditMetrics.missing2fa?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: '#16A34A' }}>
                    <ShieldCheck size={32} style={{ margin: '0 auto 8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.90rem' }}>All Accounts Have 2FA Configured!</strong>
                    <span style={{ fontSize: '0.80rem', color: '#64748B' }}>
                      Your vault acts as a complete authenticator app.
                    </span>
                  </div>
                ) : (
                  <div>
                    {auditMetrics.missing2fa.slice(0, 6).map((item) => (
                      <div key={item.id} className="vault-audit-item-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <CompanyLogo name={item.name} url={item.url} size={28} />
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: '0.88rem', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </strong>
                            <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                              {item.username || 'Standard Account'}
                            </span>
                          </div>
                        </div>

                        <button
                          className="vault-audit-upgrade-btn"
                          onClick={(e) => handleOpenEdit(item, e)}
                          style={{ background: '#DBEAFE', color: '#1E40AF', borderColor: '#1E40AF' }}
                        >
                          <Shield size={12} />
                          <span>Add 2FA Key</span>
                        </button>
                      </div>
                    ))}
                    {auditMetrics.missing2fa.length > 6 && (
                      <p style={{ fontSize: '0.76rem', color: '#64748B', textAlign: 'center', marginTop: 8 }}>
                        + {auditMetrics.missing2fa.length - 6} more accounts without 2FA
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="vault-empty-state">
            <div className="vault-empty-icon">
              <ShieldCheck size={32} />
            </div>
            <h3>
              {searchQuery
                ? `No credentials match "${searchQuery}"`
                : activeCategory === 'Favorites'
                ? 'No Starred Credentials Yet'
                : activeCategory === 'At-Risk'
                ? 'All Passwords Are Secure!'
                : 'Your Vault is Ready'}
            </h3>
            <p>
              {searchQuery
                ? 'Try searching with a different keyword, category, or website URL.'
                : 'Add your first password to experience zero-knowledge encrypted security.'}
            </p>
            {searchQuery ? (
              <button className="vault-btn-primary" onClick={() => setSearchQuery('')}>
                <X size={16} />
                <span>Clear Search Filter</span>
              </button>
            ) : (
              <button className="vault-btn-primary" onClick={handleOpenAddModal}>
                <Plus size={16} />
                <span>Add Your First Password</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="vault-grid-layout">
            {filteredAndSortedItems.map((item) => {
              const isRevealed = Boolean(revealedIds[item.id]);
              const isCopied = copiedId === item.id;
              const isUserCopied = copiedUsernameId === item.id;

              return (
                <article key={item.id} className="vault-card-item">
                  {/* Card Header: Brand Logo, Title, Username, Star */}
                  <div className="vault-card-header">
                    <div className="vault-card-brand">
                      <div className="vault-card-logo-wrap">
                        <CompanyLogo name={item.name} url={item.url} size={32} />
                      </div>
                      <div className="vault-card-meta">
                        <div className="vault-card-title-row">
                          <h4 className="vault-card-title" title={item.name}>
                            {item.name}
                          </h4>
                          {sanitizeSafeUrl(item.url) && (
                            <a
                              href={sanitizeSafeUrl(item.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="vault-card-url-link"
                              title={`Open ${item.url}`}
                            >
                              <ArrowUpRight size={14} />
                            </a>
                          )}
                        </div>
                        <div className="vault-card-user">
                          <span>{item.username}</span>
                          {item.username && (
                            <button
                              className="vault-copy-user-btn"
                              onClick={(e) => handleCopyUsername(item.username, item.id, e)}
                              title="Copy username"
                            >
                              {isUserCopied ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="vault-card-badges">
                      <button
                        className={`vault-favorite-btn ${item.isFavorite ? 'is-fav' : ''}`}
                        onClick={(e) => handleToggleFavorite(item, e)}
                        title={item.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                      >
                        <Star size={16} fill={item.isFavorite ? '#F59E0B' : 'none'} />
                      </button>
                      <span className={`vault-strength-pill ${item.strength.toLowerCase()}`}>
                        {item.strength}
                      </span>
                    </div>
                  </div>

                  {/* Password Display Box */}
                  <div className="vault-password-box">
                    <span className={`vault-password-text ${isRevealed ? '' : 'masked'}`}>
                      {isRevealed ? item.password : '••••••••••••••••'}
                    </span>
                    <div className="vault-pass-actions">
                      <button
                        className="vault-icon-btn"
                        onClick={(e) => toggleReveal(item.id, e)}
                        title={isRevealed ? 'Hide password' : 'Show password'}
                      >
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        className={`vault-icon-btn ${isCopied ? 'copied' : ''}`}
                        onClick={(e) => handleCopyPassword(item.password, item.id, e)}
                        title="Copy password"
                      >
                        {isCopied ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Built-in 2FA / TOTP Authenticator */}
                  {item.totpSecret && (
                    <div className="vault-totp-container">
                      <div className="vault-totp-header">
                        <div className="vault-totp-badge">
                          <Shield size={12} color="#16A34A" />
                          <span>2FA Code</span>
                        </div>
                        <div className="vault-totp-timer">
                          <Clock size={11} color="#64748B" />
                          <span className="vault-totp-timer-sec">{totpTimeRemaining}s</span>
                        </div>
                      </div>
                      <div className="vault-totp-code-row">
                        <span className="vault-totp-code">
                          {totpCodes[item.id] || '--- ---'}
                        </span>
                        <button
                          className="vault-totp-copy-btn"
                          onClick={(e) => handleCopyTOTP(totpCodes[item.id], item.id, e)}
                          title="Copy 2FA Code (Auto-scrub in 30s)"
                        >
                          {copiedTotpId === item.id ? (
                            <>
                              <Check size={12} color="#B5F2B7" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy 2FA</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Secret Notes Preview (if any) */}
                  {item.notes && (
                    <div className="vault-notes-preview" title={item.notes}>
                      <Key size={12} />
                      <span>{item.notes}</span>
                    </div>
                  )}

                  {/* Card Footer: Category tag + Actions */}
                  <div className="vault-card-footer">
                    <span className="vault-footer-category">{item.category}</span>
                    <div className="vault-card-footer-actions">
                      <button className="vault-action-btn-text" onClick={(e) => handleOpenEdit(item, e)}>
                        Edit
                      </button>
                      <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
                      <button className="vault-action-btn-text delete" onClick={(e) => handleDeleteItem(item, e)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* COMPACT LIST / TABLE VIEW */
          <div className="vault-table-container">
            <table className="vault-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>Fav</th>
                  <th>Service / Website</th>
                  <th>Username / Email</th>
                  <th>Encrypted Password</th>
                  <th>2FA Authenticator</th>
                  <th>Category</th>
                  <th>Security</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedItems.map((item) => {
                  const isRevealed = Boolean(revealedIds[item.id]);
                  const isCopied = copiedId === item.id;
                  const isUserCopied = copiedUsernameId === item.id;

                  return (
                    <tr key={item.id} className="vault-table-row">
                      <td>
                        <button
                          className={`vault-favorite-btn ${item.isFavorite ? 'is-fav' : ''}`}
                          onClick={(e) => handleToggleFavorite(item, e)}
                        >
                          <Star size={15} fill={item.isFavorite ? '#F59E0B' : 'none'} />
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <CompanyLogo name={item.name} url={item.url} size={24} />
                          <div>
                            <strong style={{ color: '#F8FAFC' }}>{item.name}</strong>
                            {sanitizeSafeUrl(item.url) && (
                              <a
                                href={sanitizeSafeUrl(item.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginLeft: 6, color: '#64748B', display: 'inline-flex', verticalAlign: 'middle' }}
                                title={`Open ${item.url}`}
                              >
                                <ArrowUpRight size={13} />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: '#94A3B8' }}>{item.username}</span>
                        {item.username && (
                          <button
                            className="vault-copy-user-btn"
                            onClick={(e) => handleCopyUsername(item.username, item.id, e)}
                            style={{ marginLeft: 6 }}
                          >
                            {isUserCopied ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                          </button>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              letterSpacing: isRevealed ? '0.08em' : '0.2em',
                              color: isRevealed ? '#000000' : '#64748B',
                              fontWeight: 800
                            }}
                          >
                            {isRevealed ? item.password : '••••••••••••'}
                          </span>
                          <button
                            className="vault-icon-btn"
                            onClick={(e) => toggleReveal(item.id, e)}
                            style={{ width: 24, height: 24 }}
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            className={`vault-icon-btn ${isCopied ? 'copied' : ''}`}
                            onClick={(e) => handleCopyPassword(item.password, item.id, e)}
                            style={{ width: 24, height: 24 }}
                          >
                            {isCopied ? <Check size={13} color="#34D399" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                      <td>
                        {item.totpSecret ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.1em', fontSize: '0.90rem', color: '#000000' }}>
                              {totpCodes[item.id] || '------'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                              ({totpTimeRemaining}s)
                            </span>
                            <button
                              className="vault-icon-btn"
                              onClick={(e) => handleCopyTOTP(totpCodes[item.id], item.id, e)}
                              title="Copy 2FA Code"
                              style={{ width: 22, height: 22 }}
                            >
                              {copiedTotpId === item.id ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                            None
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="vault-footer-category">{item.category}</span>
                      </td>
                      <td>
                        <span className={`vault-strength-pill ${item.strength.toLowerCase()}`}>
                          {item.strength}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button className="vault-action-btn-text" onClick={(e) => handleOpenEdit(item, e)}>
                            <Edit3 size={15} />
                          </button>
                          <button className="vault-action-btn-text delete" onClick={(e) => handleDeleteItem(item, e)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MASTER PASSWORD ZERO-KNOWLEDGE UNLOCK / SETUP SCREEN */}
      {/* Only show after vault status check completes — prevents wrong screen flash on load */}
      {isVaultLocked && !isCheckingVaultStatus && (
        <div className="vault-lock-overlay">
          <div className="vault-lock-card">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <VaultSyncLogoIcon size={54} />
            </div>

            {/* If NO existing vault, show First-Time Setup title; if vault exists, show Unlock title */}
            <h2 className="vault-lock-title">
              {hasExistingVault ? 'Unlock Your Vault' : 'Create Master Password'}
            </h2>
            <p className="vault-lock-subtitle">
              {hasExistingVault
                ? 'Your passwords are end-to-end encrypted with client-side AES-256-GCM.'
                : 'Choose a strong, memorable master password. It derives your local AES-256-GCM encryption key.'}
            </p>

            <div className="vault-lock-user-chip">
              <Lock size={14} style={{ color: '#16A34A', flexShrink: 0 }} />
              <span>
                Signed in as <strong>{user.email || user.name}</strong>
              </span>
            </div>

            <form onSubmit={handleUnlockVault}>
              {unlockError && <div className="vault-lock-error">{unlockError}</div>}

              {isSetupMode && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = generateSecurePassword(16, true, true, true, false);
                      setUnlockPassword(generated);
                      setConfirmUnlockPassword(generated);
                      setShowUnlockPass(true);
                      triggerToast('Suggested strong master password! Be sure to remember it.');
                    }}
                    style={{
                      background: '#FAF7EE',
                      border: '1.5px solid #000000',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      boxShadow: '1.5px 1.5px 0 #000000'
                    }}
                  >
                    <Dices size={13} />
                    <span>Generate with VaultSyncc (or type your own below)</span>
                  </button>
                </div>
              )}

              {/* Master Password input */}
              <div className="vault-lock-input-wrap">
                <input
                  type={showUnlockPass ? 'text' : 'password'}
                  placeholder={!hasExistingVault ? 'Create Master Password (min 8 chars)' : 'Enter Master Password'}
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="vault-lock-input"
                  required
                  autoFocus
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowUnlockPass(!showUnlockPass)}
                  className="vault-lock-eye-btn"
                  title={showUnlockPass ? 'Hide' : 'Show'}
                  suppressHydrationWarning
                >
                  {showUnlockPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!hasExistingVault && unlockPassword && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '-6px 4px 10px', fontSize: '0.75rem' }}>
                  <span style={{ color: '#64748B' }}>Password Strength:</span>
                  <span style={{
                    fontWeight: '800',
                    color: calculateStrength(unlockPassword) === 'Strong' ? '#16A34A' : calculateStrength(unlockPassword) === 'Moderate' ? '#D97706' : '#DC2626'
                  }}>
                    {calculateStrength(unlockPassword)} ({calculateEntropy(unlockPassword)} bits)
                  </span>
                </div>
              )}

              {!hasExistingVault && (
                <div className="vault-lock-input-wrap" style={{ marginTop: '10px' }}>
                  <input
                    type={showUnlockPass ? 'text' : 'password'}
                    placeholder="Confirm Master Password"
                    value={confirmUnlockPassword}
                    onChange={(e) => setConfirmUnlockPassword(e.target.value)}
                    className="vault-lock-input"
                    required
                    suppressHydrationWarning
                  />
                </div>
              )}

              <button type="submit" className="vault-lock-submit-btn" disabled={isUnlocking} suppressHydrationWarning>
                {isUnlocking ? (
                  <>
                    <div className="vault-spinner" style={{ width: 18, height: 18 }} />
                    <span>Deriving PBKDF2 Key...</span>
                  </>
                ) : (
                  <>
                    <Unlock size={18} />
                    <span>{!hasExistingVault ? 'Initialize Secure Vault' : 'Unlock Encrypted Vault'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Reset Vault Option */}
            {hasExistingVault && (
              <div style={{ marginTop: 14, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleResetVault}
                  disabled={isResettingVault}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '4px 8px'
                  }}
                >
                  {isResettingVault ? 'Resetting Vault...' : 'Forgot Master Password? Reset Vault'}
                </button>
              </div>
            )}

            <p className="vault-lock-footnote" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, justifyContent: 'center' }}>
              <Info size={15} style={{ flexShrink: 0, marginTop: 2, color: '#64748B' }} />
              <span>
                {!hasExistingVault
                  ? 'Your master password never leaves your browser. Keep it safe—Zero-Knowledge means only you can decrypt your vault.'
                  : 'Protected with local AES-256-GCM encryption. Your master password is never stored or transmitted to any server.'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="vault-modal-backdrop active" onClick={() => !isSaving && setIsAddModalOpen(false)}>
          <div className="vault-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="vault-modal-header">
              <div className="vault-modal-title-group">
                <div className="vault-modal-icon-badge">
                  <Plus size={20} />
                </div>
                <h3>Add New Credential</h3>
              </div>
              <button className="vault-modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="vault-modal-form">
              {/* Name & Auto Logo */}
              <div className="vault-form-field">
                <label className="vault-form-label">Service or Website Name</label>
                <div className="vault-form-input-with-logo">
                  <div className="vault-form-logo-box">
                    <CompanyLogo name={newItemName.trim() || 'Vault'} url={newItemUrl} size={26} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Google, GitHub, Netflix, OpenAI, Amazon"
                    value={newItemName}
                    onChange={(e) => handleNewNameChange(e.target.value)}
                    className="vault-form-input"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="vault-form-field">
                <label className="vault-form-label">Website URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/login"
                  value={newItemUrl}
                  onChange={(e) => {
                    setIsAddUrlCustomized(true);
                    setNewItemUrl(e.target.value);
                  }}
                  className="vault-form-input-standard"
                />
              </div>

              {/* Username / Email */}
              <div className="vault-form-field">
                <label className="vault-form-label">Username or Email</label>
                <input
                  type="text"
                  placeholder="alex@example.com"
                  value={newItemUser}
                  onChange={(e) => setNewItemUser(e.target.value)}
                  className="vault-form-input-standard"
                  required
                />
              </div>

              {/* PASSWORD CREATION SELECTION: VAULTSYNC GENERATOR VS CREATE OWN */}
              <div className="vault-form-field">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label className="vault-form-label" style={{ margin: 0 }}>Password</label>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color:
                        calculateStrength(newItemPass) === 'Strong'
                          ? '#16A34A'
                          : calculateStrength(newItemPass) === 'Moderate'
                          ? '#D97706'
                          : '#DC2626'
                    }}
                  >
                    {calculateStrength(newItemPass)} ({calculateEntropy(newItemPass)} bits)
                  </span>
                </div>

                {/* Mode Selector Tabs */}
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    background: '#F1F5F9',
                    border: '1.5px solid #000000',
                    padding: '4px',
                    borderRadius: '30px',
                    marginBottom: 12
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setPassCreationMode('generate');
                      if (!newItemPass || calculateStrength(newItemPass) !== 'Strong') {
                        setNewItemPass(generateSecurePassword(18, true, true, true, true));
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      borderRadius: '24px',
                      border: 'none',
                      fontSize: '0.80rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      background: passCreationMode === 'generate' ? '#000000' : 'transparent',
                      color: passCreationMode === 'generate' ? '#FFFFFF' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Zap size={14} color={passCreationMode === 'generate' ? '#B5F2B7' : '#64748B'} />
                    <span>Generated by VaultSyncc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPassCreationMode('custom');
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      borderRadius: '24px',
                      border: 'none',
                      fontSize: '0.80rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      background: passCreationMode === 'custom' ? '#000000' : 'transparent',
                      color: passCreationMode === 'custom' ? '#FFFFFF' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Edit3 size={14} color={passCreationMode === 'custom' ? '#B5F2B7' : '#64748B'} />
                    <span>Create My Own Password</span>
                  </button>
                </div>

                {/* MODE 1: VAULTSYNC GENERATOR */}
                {passCreationMode === 'generate' ? (
                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #000000',
                      borderRadius: '16px',
                      padding: '14px',
                      boxShadow: '2px 2px 0 #000000'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.78rem', color: '#475569', fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Sparkles size={13} color="#16A34A" />
                        <span>High-Entropy Cryptographic Password</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewItemPass(generateSecurePassword(18, true, true, true, true))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#000000',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.76rem',
                          textDecoration: 'underline'
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Regenerate</span>
                      </button>
                    </div>

                    <div className="vault-pass-input-row">
                      <input
                        type={showNewItemPass ? 'text' : 'password'}
                        value={newItemPass}
                        onChange={(e) => setNewItemPass(e.target.value)}
                        className="vault-form-input-standard"
                        style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.06em', fontWeight: 700 }}
                        required
                      />
                      <button
                        type="button"
                        className="vault-icon-btn"
                        onClick={() => setShowNewItemPass(!showNewItemPass)}
                        title={showNewItemPass ? 'Hide password' : 'Show password'}
                        style={{ width: 36, height: 36 }}
                      >
                        {showNewItemPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        type="button"
                        className="vault-embed-gen-btn"
                        onClick={() => setNewItemPass(generateSecurePassword(18, true, true, true, true))}
                        title="Generate a new randomized password"
                      >
                        <Dices size={15} />
                        <span>New</span>
                      </button>
                    </div>

                    {/* Quick length presets */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>Preset Length:</span>
                      {[14, 18, 22, 28].map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => setNewItemPass(generateSecurePassword(len, true, true, true, true))}
                          style={{
                            border: '1px solid #000000',
                            borderRadius: '12px',
                            background: newItemPass.length === len ? '#000000' : '#FFFFFF',
                            color: newItemPass.length === len ? '#FFFFFF' : '#475569',
                            padding: '3px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: newItemPass.length === len ? '1px 1px 0 #000000' : 'none'
                          }}
                        >
                          {len} chars
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* MODE 2: USER CREATES THEIR OWN PASSWORD */
                  <div
                    style={{
                      background: '#FAF7EE',
                      border: '1.5px solid #000000',
                      borderRadius: '16px',
                      padding: '14px',
                      boxShadow: '2px 2px 0 #000000'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.78rem', color: '#000000', fontWeight: 800 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Edit3 size={13} />
                        <span>Enter Your Custom Password</span>
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                        {newItemPass.length} characters typed
                      </span>
                    </div>

                    <div className="vault-pass-input-row">
                      <input
                        type={showNewItemPass ? 'text' : 'password'}
                        placeholder="Type your own secret password..."
                        value={newItemPass}
                        onChange={(e) => setNewItemPass(e.target.value)}
                        className="vault-form-input-standard"
                        autoFocus
                        required
                        style={{ fontFamily: showNewItemPass ? 'monospace' : 'inherit', fontSize: '0.98rem' }}
                      />
                      <button
                        type="button"
                        className="vault-icon-btn"
                        onClick={() => setShowNewItemPass(!showNewItemPass)}
                        title={showNewItemPass ? 'Hide password' : 'Show password'}
                        style={{ width: 36, height: 36 }}
                      >
                        {showNewItemPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Live Strength Checklist */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px', marginTop: 12, fontSize: '0.74rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: newItemPass.length >= 8 ? '#15803D' : '#94A3B8', fontWeight: 700 }}>
                        {newItemPass.length >= 8 ? <Check size={13} strokeWidth={3} color="#15803D" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #CBD5E1', display: 'inline-block' }} />}
                        <span>8+ Characters</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: (/[A-Z]/.test(newItemPass) && /[a-z]/.test(newItemPass)) ? '#15803D' : '#94A3B8', fontWeight: 700 }}>
                        {(/[A-Z]/.test(newItemPass) && /[a-z]/.test(newItemPass)) ? <Check size={13} strokeWidth={3} color="#15803D" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #CBD5E1', display: 'inline-block' }} />}
                        <span>Upper &amp; Lowercase</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: /\d/.test(newItemPass) ? '#15803D' : '#94A3B8', fontWeight: 700 }}>
                        {/\d/.test(newItemPass) ? <Check size={13} strokeWidth={3} color="#15803D" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #CBD5E1', display: 'inline-block' }} />}
                        <span>Numbers (0–9)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: /[^A-Za-z0-9]/.test(newItemPass) ? '#15803D' : '#94A3B8', fontWeight: 700 }}>
                        {/[^A-Za-z0-9]/.test(newItemPass) ? <Check size={13} strokeWidth={3} color="#15803D" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #CBD5E1', display: 'inline-block' }} />}
                        <span>Symbols (!@#$%)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strength Meter Bar */}
                <div className="vault-strength-meter" style={{ marginTop: 10 }}>
                  <div
                    className="vault-strength-bar"
                    style={{
                      width:
                        calculateStrength(newItemPass) === 'Strong'
                          ? '100%'
                          : calculateStrength(newItemPass) === 'Moderate'
                          ? '60%'
                          : '25%',
                      backgroundColor:
                        calculateStrength(newItemPass) === 'Strong'
                          ? '#10B981'
                          : calculateStrength(newItemPass) === 'Moderate'
                          ? '#F59E0B'
                          : '#F43F5E'
                    }}
                  />
                </div>
              </div>

              {/* Category & Favorite row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="vault-form-field">
                  <label className="vault-form-label">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="vault-form-input-standard"
                  >
                    <option value="Logins">Logins</option>
                    <option value="Work">Work</option>
                    <option value="Finance">Finance</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="vault-form-field" style={{ justifyContent: 'center' }}>
                  <label className="vault-form-label">&nbsp;</label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#000000'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newItemIsFav}
                      onChange={(e) => setNewItemIsFav(e.target.checked)}
                      style={{ accentColor: '#000000', width: 16, height: 16 }}
                    />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span>Add to Favorites</span>
                      <Star size={13} fill="#F59E0B" stroke="#D97706" />
                    </span>
                  </label>
                </div>
              </div>

              {/* 2FA Authenticator Key (replaces Google Authenticator) */}
              <div className="vault-form-field">
                <div className="vault-form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>2FA Authenticator Secret (Optional)</span>
                  <span style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 800 }}>Replaces Google Authenticator</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. JBSWY3DPEHPK3PXP (or paste otpauth:// QR link)"
                  value={newItemTotp}
                  onChange={(e) => setNewItemTotp(extractTOTPSecret(e.target.value))}
                  className="vault-form-input-standard"
                  style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
                />
              </div>

              {/* Secret Notes */}
              <div className="vault-form-field">
                <label className="vault-form-label">Encrypted Secret Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Recovery codes, security answers, PINs..."
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  className="vault-form-textarea"
                />
              </div>

              <div className="vault-form-actions-row">
                <button
                  type="button"
                  className="vault-btn-ghost"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="vault-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Encrypting & Storing...' : 'Save & Encrypt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {isEditModalOpen && (
        <div className="vault-modal-backdrop active" onClick={() => !isSaving && setIsEditModalOpen(false)}>
          <div className="vault-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="vault-modal-header">
              <div className="vault-modal-title-group">
                <div className="vault-modal-icon-badge" style={{ background: '#B5F2B7', color: '#000000' }}>
                  <Edit3 size={20} />
                </div>
                <h3>Edit Credential</h3>
              </div>
              <button className="vault-modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="vault-modal-form">
              <div className="vault-form-field">
                <label className="vault-form-label">Service or Website Name</label>
                <div className="vault-form-input-with-logo">
                  <div className="vault-form-logo-box">
                    <CompanyLogo name={editItemName.trim() || 'Vault'} url={editItemUrl} size={26} />
                  </div>
                  <input
                    type="text"
                    value={editItemName}
                    onChange={(e) => setEditItemName(e.target.value)}
                    className="vault-form-input"
                    required
                  />
                </div>
              </div>

              <div className="vault-form-field">
                <label className="vault-form-label">Website URL</label>
                <input
                  type="text"
                  value={editItemUrl}
                  onChange={(e) => setEditItemUrl(e.target.value)}
                  className="vault-form-input-standard"
                />
              </div>

              <div className="vault-form-field">
                <label className="vault-form-label">Username or Email</label>
                <input
                  type="text"
                  value={editItemUser}
                  onChange={(e) => setEditItemUser(e.target.value)}
                  className="vault-form-input-standard"
                  required
                />
              </div>

              {/* Password with Dual-Mode Selection: Edit Custom vs Generate from VaultSync */}
              <div className="vault-form-field">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label className="vault-form-label" style={{ margin: 0 }}>Password</label>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color:
                        calculateStrength(editItemPass) === 'Strong'
                          ? '#16A34A'
                          : calculateStrength(editItemPass) === 'Moderate'
                          ? '#D97706'
                          : '#DC2626'
                    }}
                  >
                    {calculateStrength(editItemPass)} ({calculateEntropy(editItemPass)} bits)
                  </span>
                </div>

                {/* Mode Selector Tabs */}
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    background: '#F1F5F9',
                    border: '1.5px solid #000000',
                    padding: '4px',
                    borderRadius: '30px',
                    marginBottom: 12
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setEditPassCreationMode('custom')}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      borderRadius: '24px',
                      border: 'none',
                      fontSize: '0.80rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      background: editPassCreationMode === 'custom' ? '#000000' : 'transparent',
                      color: editPassCreationMode === 'custom' ? '#FFFFFF' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Edit3 size={14} color={editPassCreationMode === 'custom' ? '#B5F2B7' : '#64748B'} />
                    <span>My Custom Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditPassCreationMode('generate');
                      setEditItemPass(generateSecurePassword(18, true, true, true, true));
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      borderRadius: '24px',
                      border: 'none',
                      fontSize: '0.80rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      background: editPassCreationMode === 'generate' ? '#000000' : 'transparent',
                      color: editPassCreationMode === 'generate' ? '#FFFFFF' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Zap size={14} color={editPassCreationMode === 'generate' ? '#B5F2B7' : '#64748B'} />
                    <span>Generate with VaultSyncc</span>
                  </button>
                </div>

                <div className="vault-pass-input-row">
                  <input
                    type={showEditItemPass ? 'text' : 'password'}
                    value={editItemPass}
                    onChange={(e) => setEditItemPass(e.target.value)}
                    className="vault-form-input-standard"
                    required
                    style={{ fontFamily: showEditItemPass ? 'monospace' : 'inherit', fontSize: '0.98rem' }}
                  />
                  <button
                    type="button"
                    className="vault-icon-btn"
                    onClick={() => setShowEditItemPass(!showEditItemPass)}
                    title={showEditItemPass ? 'Hide password' : 'Show password'}
                    style={{ width: 36, height: 36 }}
                  >
                    {showEditItemPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    type="button"
                    className="vault-embed-gen-btn"
                    onClick={() => {
                      setEditItemPass(generateSecurePassword(18, true, true, true, true));
                      setEditPassCreationMode('generate');
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    title="Generate a randomized password"
                  >
                    <Dices size={14} />
                    <span>Regen</span>
                  </button>
                </div>

                {/* Strength Meter Bar */}
                <div className="vault-strength-meter" style={{ marginTop: 10 }}>
                  <div
                    className="vault-strength-bar"
                    style={{
                      width:
                        calculateStrength(editItemPass) === 'Strong'
                          ? '100%'
                          : calculateStrength(editItemPass) === 'Moderate'
                          ? '60%'
                          : '25%',
                      backgroundColor:
                        calculateStrength(editItemPass) === 'Strong'
                          ? '#10B981'
                          : calculateStrength(editItemPass) === 'Moderate'
                          ? '#F59E0B'
                          : '#F43F5E'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="vault-form-field">
                  <label className="vault-form-label">Category</label>
                  <select
                    value={editItemCategory}
                    onChange={(e) => setEditItemCategory(e.target.value)}
                    className="vault-form-input-standard"
                  >
                    <option value="Logins">Logins</option>
                    <option value="Work">Work</option>
                    <option value="Finance">Finance</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="vault-form-field" style={{ justifyContent: 'center' }}>
                  <label className="vault-form-label">&nbsp;</label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#000000'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editItemIsFav}
                      onChange={(e) => setEditItemIsFav(e.target.checked)}
                      style={{ accentColor: '#000000', width: 16, height: 16 }}
                    />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span>Add to Favorites</span>
                      <Star size={13} fill="#F59E0B" stroke="#D97706" />
                    </span>
                  </label>
                </div>
              </div>

              {/* 2FA Authenticator Key */}
              <div className="vault-form-field">
                <div className="vault-form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>2FA Authenticator Secret (Optional)</span>
                  <span style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 800 }}>Replaces Google Authenticator</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. JBSWY3DPEHPK3PXP (or paste otpauth:// QR link)"
                  value={editItemTotp}
                  onChange={(e) => setNewItemTotpEdit(extractTOTPSecret(e.target.value))}
                  className="vault-form-input-standard"
                  style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
                />
              </div>

              <div className="vault-form-field">
                <label className="vault-form-label">Encrypted Secret Notes</label>
                <textarea
                  rows={2}
                  value={editItemNotes}
                  onChange={(e) => setEditItemNotes(e.target.value)}
                  className="vault-form-textarea"
                />
              </div>

              {/* Password History Drawer (if previous passwords exist) */}
              {editItemHistory && editItemHistory.length > 0 && (
                <div className="vault-history-drawer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.78rem', fontWeight: 800, color: '#475569' }}>
                    <History size={14} />
                    <span>Encrypted Password History ({editItemHistory.length} previous versions)</span>
                  </div>
                  {editItemHistory.map((h, hIdx) => (
                    <div key={hIdx} className="vault-history-entry">
                      <div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, marginRight: 8, color: '#000000' }}>
                          ••••••••••••
                        </span>
                        <span style={{ color: '#64748B', fontSize: '0.72rem' }}>
                          {new Date(h.changedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="vault-audit-upgrade-btn"
                        style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                        onClick={() => {
                          setEditItemPass(h.password);
                          triggerToast('Restored previous password into form');
                        }}
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="vault-form-actions-row">
                <button
                  type="button"
                  className="vault-btn-ghost"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="vault-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Encrypting & Updating...' : 'Update Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT FROM GOOGLE CHROME / CSV / JSON MODAL */}
      {isImportModalOpen && (
        <div className="vault-modal-backdrop active" onClick={() => !isImporting && setIsImportModalOpen(false)}>
          <div className="vault-modal-box" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="vault-modal-header">
              <div className="vault-modal-title-group">
                <div className="vault-modal-icon-badge" style={{ background: '#B5F2B7', color: '#000000' }}>
                  <Upload size={20} />
                </div>
                <h3>Import from Google Chrome</h3>
              </div>
              <button className="vault-modal-close-btn" onClick={() => !isImporting && setIsImportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', marginBottom: 16, lineHeight: 1.5 }}>
              Migrate seamlessly from Google Chrome, 1Password, Bitwarden, or any standard CSV/JSON export.
              All credentials will be <strong>encrypted client-side with AES-256-GCM</strong> before saving.
            </p>

            {/* Dropzone */}
            <label className="vault-import-dropzone" style={{ display: 'block' }}>
              <input
                type="file"
                accept=".csv, .json, text/csv, application/json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={isImporting}
              />
              <div className="vault-import-icon-wrap">
                <FileText size={26} color="#000000" />
              </div>
              <strong style={{ display: 'block', fontSize: '1rem', color: '#000000', marginBottom: 4 }}>
                {importParsedItems.length > 0 ? 'File Loaded! Click to choose another' : 'Click to Upload Chrome CSV or JSON'}
              </strong>
              <span style={{ fontSize: '0.80rem', color: '#64748B' }}>
                In Chrome: Settings &rarr; Autofill & passwords &rarr; Google Password Manager &rarr; Settings &rarr; Export (.csv)
              </span>
            </label>

            {/* Parsed Accounts Table Preview */}
            {importParsedItems.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: '0.90rem', color: '#000000' }}>
                    {importParsedItems.filter((i) => i.selected).length} of {importParsedItems.length} accounts selected
                  </strong>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="vault-btn-ghost"
                      style={{ padding: '3px 10px', fontSize: '0.74rem' }}
                      onClick={() => setImportParsedItems((prev) => prev.map((i) => ({ ...i, selected: true })))}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="vault-btn-ghost"
                      style={{ padding: '3px 10px', fontSize: '0.74rem' }}
                      onClick={() => setImportParsedItems((prev) => prev.map((i) => ({ ...i, selected: false })))}
                    >
                      Deselect
                    </button>
                  </div>
                </div>

                <div className="vault-import-table-container">
                  <table className="vault-import-table">
                    <thead>
                      <tr>
                        <th style={{ width: 36 }}></th>
                        <th>Website / Service</th>
                        <th>Username / Email</th>
                        <th>Password Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importParsedItems.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setImportParsedItems((prev) =>
                                  prev.map((it, i) => (i === idx ? { ...it, selected: checked } : it))
                                );
                              }}
                              style={{ accentColor: '#000000' }}
                            />
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <CompanyLogo name={item.name} url={item.url} size={22} />
                              <div>
                                <strong style={{ color: '#000000', display: 'block' }}>{item.name}</strong>
                                {item.url && <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{item.url}</div>}
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#475569' }}>{item.username || '—'}</td>
                          <td>
                            <span className={`vault-strength-pill ${item.strength.toLowerCase()}`}>
                              {item.strength}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isImporting && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, marginBottom: 4 }}>
                      <span>Encrypting with AES-256-GCM...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <div className="vault-strength-meter">
                      <div className="vault-strength-bar" style={{ width: `${importProgress}%`, background: '#10B981' }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="vault-form-actions-row" style={{ marginTop: 22 }}>
              <button
                type="button"
                className="vault-btn-ghost"
                onClick={() => setIsImportModalOpen(false)}
                disabled={isImporting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="vault-btn-primary"
                onClick={handleExecuteImport}
                disabled={isImporting || importParsedItems.filter((i) => i.selected).length === 0}
              >
                {isImporting ? (
                  <>
                    <div className="vault-spinner" style={{ width: 16, height: 16 }} />
                    <span>Encrypting & Storing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>
                      Encrypt & Import {importParsedItems.filter((i) => i.selected).length} Accounts
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CLIPBOARD MEMORY GUARD FLOATING PILL */}
      {clipboardGuard.active && (
        <div className="vault-clipboard-guard-pill">
          <div className="vault-clipboard-guard-pulse" />
          <ShieldAlert size={16} className="vault-clipboard-icon" />
          <span className="vault-clipboard-guard-text">
            OS Clipboard Protected: <strong>{clipboardGuard.type}</strong> will be wiped in{' '}
            <strong>{clipboardGuard.countdown}s</strong>
          </span>
          <button
            type="button"
            className="vault-clipboard-clear-btn"
            onClick={handleClearClipboardManual}
          >
            Clear Now
          </button>
        </div>
      )}

      {/* STANDALONE PASSWORD GENERATOR MODAL */}
      {isGeneratorModalOpen && (
        <div className="vault-modal-backdrop active" onClick={() => setIsGeneratorModalOpen(false)}>
          <div className="vault-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="vault-modal-header">
              <div className="vault-modal-title-group">
                <div className="vault-modal-icon-badge">
                  <Sliders size={20} />
                </div>
                <h3>Cryptographic Password Generator</h3>
              </div>
              <button className="vault-modal-close-btn" onClick={() => setIsGeneratorModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Generated Password Box */}
            <div className="vault-gen-card">
              <div className="vault-gen-result-box">
                <span className="vault-gen-result-text">{generatedPassword}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="vault-icon-btn" onClick={handleRegenStandalone} title="Regenerate">
                    <RefreshCw size={15} />
                  </button>
                  <button
                    className={`vault-icon-btn ${copiedGen ? 'copied' : ''}`}
                    onClick={handleCopyStandaloneGen}
                    title="Copy to clipboard"
                  >
                    {copiedGen ? <Check size={15} color="#34D399" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* Entropy Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.78rem', color: '#94A3B8' }}>
                <span>Strength: <strong style={{ color: '#34D399' }}>{calculateStrength(generatedPassword)}</strong></span>
                <span>Entropy: <strong style={{ color: '#34D399' }}>{calculateEntropy(generatedPassword)} bits</strong></span>
              </div>
            </div>

            {/* Slider */}
            <div className="vault-form-field" style={{ marginBottom: 16 }}>
              <div className="vault-form-label">
                <span>Password Length</span>
                <strong style={{ color: '#34D399', fontSize: '0.92rem' }}>{genLength} characters</strong>
              </div>
              <input
                type="range"
                min={8}
                max={48}
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                className="vault-slider"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${((genLength - 8) / 40) * 100}%, rgba(255,255,255,0.1) ${((genLength - 8) / 40) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>

            {/* Character Preset Toggles */}
            <div className="vault-gen-controls-grid">
              <label className="vault-gen-toggle-item">
                <input type="checkbox" checked={genUpper} onChange={(e) => setGenUpper(e.target.checked)} />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="vault-gen-toggle-item">
                <input type="checkbox" checked={genLower} onChange={(e) => setGenLower(e.target.checked)} />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="vault-gen-toggle-item">
                <input type="checkbox" checked={genNumbers} onChange={(e) => setGenNumbers(e.target.checked)} />
                <span>Numbers (0-9)</span>
              </label>
              <label className="vault-gen-toggle-item">
                <input type="checkbox" checked={genSymbols} onChange={(e) => setGenSymbols(e.target.checked)} />
                <span>Symbols (!@#$%)</span>
              </label>
            </div>

            <div className="vault-form-actions-row" style={{ marginTop: 24 }}>
              <button
                type="button"
                className="vault-btn-ghost"
                onClick={() => setIsGeneratorModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="vault-btn-primary"
                onClick={() => {
                  setNewItemPass(generatedPassword);
                  setIsGeneratorModalOpen(false);
                  setIsAddModalOpen(true);
                }}
              >
                <Plus size={16} />
                <span>Use in New Credential</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BACKUP & EXPORT MODAL */}
      {isExportModalOpen && (
        <div className="vault-modal-backdrop active" onClick={() => setIsExportModalOpen(false)}>
          <div className="vault-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="vault-modal-header">
              <div className="vault-modal-title-group">
                <div className="vault-modal-icon-badge" style={{ background: '#B5F2B7', color: '#000000' }}>
                  <Download size={20} />
                </div>
                <h3>Export Vault Backup</h3>
              </div>
              <button className="vault-modal-close-btn" onClick={() => setIsExportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: 20, fontWeight: 600 }}>
              Create an offline snapshot of your credentials. You can export a metadata-only backup or a full
              decrypted JSON export for migration.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: '#FDFBF7',
                  border: '2px solid #000000',
                  borderRadius: 16,
                  padding: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: '3px 3px 0 #000000'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.96rem', color: '#000000', fontWeight: 900 }}>
                    Metadata Backup (Safe)
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                    Exports account titles, URLs, and usernames without passwords.
                  </span>
                </div>
                <button className="vault-btn-ghost" onClick={() => handleExportBackup(false)}>
                  Export
                </button>
              </div>

              <div
                style={{
                  background: '#FEF3C7',
                  border: '2px solid #000000',
                  borderRadius: 16,
                  padding: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: '3px 3px 0 #000000'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.96rem', color: '#000000', fontWeight: 900 }}>
                    Full Plaintext Backup
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                    Contains all decrypted passwords. Store in an encrypted volume.
                  </span>
                </div>
                <button
                  className="vault-btn-primary"
                  onClick={() => handleExportBackup(true)}
                >
                  Export Full
                </button>
              </div>
            </div>

            <div className="vault-form-actions-row" style={{ marginTop: 24 }}>
              <button className="vault-btn-ghost" onClick={() => setIsExportModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VAULT SETTINGS MODAL */}
      {isSettingsModalOpen && (
        <div className="vault-modal-backdrop active" onClick={() => setIsSettingsModalOpen(false)}>
          <div className="vault-modal-box" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
            <div className="vault-modal-header">
              <div className="vault-modal-title-group">
                <div className="vault-modal-icon-badge" style={{ background: '#B5F2B7', color: '#000000' }}>
                  <Settings size={20} />
                </div>
                <h3>Vault Settings</h3>
              </div>
              <button className="vault-modal-close-btn" onClick={() => setIsSettingsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Navigation tabs inside Settings */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                background: '#FAF7EE',
                border: '1.5px solid #000000',
                borderRadius: 50,
                padding: 4,
                marginBottom: 20
              }}
            >
              <button
                type="button"
                onClick={() => setSettingsTab('security')}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: 40,
                  border: 'none',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: settingsTab === 'security' ? '#000000' : 'transparent',
                  color: settingsTab === 'security' ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s'
                }}
              >
                Security & Master Key
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('autolock')}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: 40,
                  border: 'none',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: settingsTab === 'autolock' ? '#000000' : 'transparent',
                  color: settingsTab === 'autolock' ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s'
                }}
              >
                Auto-Lock
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('account')}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: 40,
                  border: 'none',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: settingsTab === 'account' ? '#000000' : 'transparent',
                  color: settingsTab === 'account' ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s'
                }}
              >
                Account & Data
              </button>
            </div>

            {/* TAB 1: SECURITY & MASTER PASSWORD */}
            {settingsTab === 'security' && (
              <form onSubmit={handleChangeMasterPassword} className="vault-modal-form">
                <div
                  style={{
                    background: '#FAF7EE',
                    border: '1.5px solid #000000',
                    borderRadius: 14,
                    padding: 14,
                    fontSize: '0.82rem',
                    color: '#475569',
                    lineHeight: 1.5,
                    boxShadow: '2px 2px 0 #000000'
                  }}
                >
                  <strong style={{ color: '#000000', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <ShieldCheck size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                    <span>Zero-Knowledge Master Password</span>
                  </strong>
                  Changing your master password will re-encrypt all stored credentials in your vault with a newly derived AES-256 PBKDF2 key.
                </div>

                {changePassError && (
                  <div className="vault-lock-error" style={{ marginBottom: 0 }}>
                    {changePassError}
                  </div>
                )}

                <div className="vault-form-field">
                  <label className="vault-form-label">New Master Password</label>
                  <input
                    type="password"
                    placeholder="At least 8 characters..."
                    value={newMasterPass}
                    onChange={(e) => setNewMasterPass(e.target.value)}
                    className="vault-form-input-standard"
                    required
                  />
                </div>

                <div className="vault-form-field">
                  <label className="vault-form-label">Confirm New Master Password</label>
                  <input
                    type="password"
                    placeholder="Re-type new master password"
                    value={confirmMasterPass}
                    onChange={(e) => setConfirmMasterPass(e.target.value)}
                    className="vault-form-input-standard"
                    required
                  />
                </div>

                <div className="vault-form-actions-row" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="vault-btn-ghost"
                    onClick={() => setIsSettingsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="vault-btn-primary"
                    disabled={isChangingPass}
                  >
                    {isChangingPass ? 'Re-Encrypting Vault...' : 'Update Master Password'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: AUTO-LOCK PREFERENCES */}
            {settingsTab === 'autolock' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                  Select how long VaultSyncc should wait before automatically locking your encrypted vault when you are away:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {[
                    { label: '5 Minutes', val: 5 },
                    { label: '15 Minutes (Default)', val: 15 },
                    { label: '30 Minutes', val: 30 },
                    { label: '1 Hour', val: 60 },
                    { label: 'Never (Not Recommended)', val: 0 }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSaveAutoLock(opt.val)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 14,
                        border: '2px solid #000000',
                        background: autoLockMinutes === opt.val ? '#B5F2B7' : '#FFFFFF',
                        color: '#000000',
                        fontWeight: 800,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: autoLockMinutes === opt.val ? '3.5px 3.5px 0 #000000' : '2px 2px 0 #000000',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{opt.label}</span>
                        {autoLockMinutes === opt.val && <Check size={16} strokeWidth={2.5} style={{ color: '#000000' }} />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="vault-form-actions-row" style={{ marginTop: 20 }}>
                  <button className="vault-btn-primary" onClick={() => setIsSettingsModalOpen(false)}>
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ACCOUNT & DATA MANAGEMENT */}
            {settingsTab === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                  style={{
                    background: '#FDFBF7',
                    border: '2px solid #000000',
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '2px 2px 0 #000000'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div className="vault-user-avatar" style={{ width: 36, height: 36 }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.96rem', color: '#000000' }}>
                        {user.name}
                      </strong>
                      <span style={{ fontSize: '0.80rem', color: '#475569' }}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span>Account ID: {user.id || 'Active Session'}</span>
                    <span>Storage: Zero-Knowledge Encrypted Vault</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    type="button"
                    className="vault-btn-ghost"
                    onClick={handleClearCache}
                    style={{ justifyContent: 'center', padding: '11px' }}
                  >
                    Clear Offline Local Cache
                  </button>

                  <button
                    type="button"
                    className="vault-btn-ghost"
                    onClick={() => {
                      setIsSettingsModalOpen(false);
                      setIsExportModalOpen(true);
                    }}
                    style={{ justifyContent: 'center', padding: '11px' }}
                  >
                    Export Vault Backup (JSON)
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      background: '#FEE2E2',
                      border: '2px solid #DC2626',
                      borderRadius: 50,
                      color: '#DC2626',
                      fontWeight: 900,
                      padding: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '2px 2px 0 #000000'
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out of VaultSyncc</span>
                  </button>
                </div>

                <div className="vault-form-actions-row" style={{ marginTop: 10 }}>
                  <button className="vault-btn-ghost" onClick={() => setIsSettingsModalOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
