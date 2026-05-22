import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { homedir } from 'os';
import { CONFIG } from './config.js';

/**
 * Token storage abstraction using keytar (preferred) with encrypted file fallback
 */

// Try to import keytar (may fail on unsupported platforms)
let keytar: any = null;
let keytarAvailable = false;
try {
  keytar = require('keytar');
  keytarAvailable = true;
} catch (err) {
  // keytar not available, will use file fallback
}

/**
 * Encrypt data for fallback file storage
 */
async function encrypt(data: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(salt),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const saltBytes = encoder.encode(salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  );

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(saltBytes.length + iv.byteLength + encrypted.byteLength);
  combined.set(saltBytes, 0);
  combined.set(iv, saltBytes.length);
  combined.set(new Uint8Array(encrypted), saltBytes.length + iv.byteLength);

  return Buffer.from(combined).toString('base64');
}

async function decrypt(encryptedBase64: string): Promise<string> {
  const combined = Uint8Array.from(Buffer.from(encryptedBase64, 'base64'));

  // Extract salt (varies, we'll store first 32), iv (12), encrypted
  const salt = combined.slice(0, 32);
  const iv = combined.slice(32, 44);
  const encrypted = combined.slice(44);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    salt,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Get fallback storage directory
 */
function getStorageDir(): string {
  const dir = path.join(homedir(), '.config', 'kvasar-cli');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  return dir;
}

/**
 * Get fallback storage file path
 */
function getStoragePath(): string {
  return path.join(getStorageDir(), 'tokens.enc');
}

/**
 * Token Store - wraps both keytar and fallback file storage
 */
export class TokenStore {
  private useKeytar: boolean;

  constructor() {
    this.useKeytar = keytarAvailable;
  }

  async setAccessToken(token: string): Promise<void> {
    if (this.useKeytar) {
      await keytar.setPassword(CONFIG.tokens.serviceName, CONFIG.tokens.accessTokenKey, token);
    } else {
      await this.setFallback(CONFIG.tokens.accessTokenKey, token);
    }
  }

  async getAccessToken(): Promise<string | null> {
    if (this.useKeytar) {
      return await keytar.getPassword(CONFIG.tokens.serviceName, CONFIG.tokens.accessTokenKey);
    } else {
      return await this.getFallback(CONFIG.tokens.accessTokenKey);
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    if (this.useKeytar) {
      await keytar.setPassword(CONFIG.tokens.serviceName, CONFIG.tokens.refreshTokenKey, token);
    } else {
      await this.setFallback(CONFIG.tokens.refreshTokenKey, token);
    }
  }

  async getRefreshToken(): Promise<string | null> {
    if (this.useKeytar) {
      return await keytar.getPassword(CONFIG.tokens.serviceName, CONFIG.tokens.refreshTokenKey);
    } else {
      return await this.getFallback(CONFIG.tokens.refreshTokenKey);
    }
  }

  async setExpiresAt(timestamp: number): Promise<void> {
    if (this.useKeytar) {
      await keytar.setPassword(CONFIG.tokens.serviceName, CONFIG.tokens.expiresAtKey, String(timestamp));
    } else {
      await this.setFallback(CONFIG.tokens.expiresAtKey, String(timestamp));
    }
  }

  async getExpiresAt(): Promise<number | null> {
    if (this.useKeytar) {
      const val = await keytar.getPassword(CONFIG.tokens.serviceName, CONFIG.tokens.expiresAtKey);
      return val ? parseInt(val, 10) : null;
    } else {
      const val = await this.getFallback(CONFIG.tokens.expiresAtKey);
      return val ? parseInt(val, 10) : null;
    }
  }

  async setIdToken(token: string): Promise<void> {
    if (this.useKeytar) {
      await keytar.setPassword(CONFIG.tokens.serviceName, CONFIG.tokens.idTokenKey, token);
    } else {
      await this.setFallback(CONFIG.tokens.idTokenKey, token);
    }
  }

  async getIdToken(): Promise<string | null> {
    if (this.useKeytar) {
      return await keytar.getPassword(CONFIG.tokens.serviceName, CONFIG.tokens.idTokenKey);
    } else {
      return await this.getFallback(CONFIG.tokens.idTokenKey);
    }
  }

  async clearAll(): Promise<void> {
    if (this.useKeytar) {
      await keytar.deletePassword(CONFIG.tokens.serviceName, CONFIG.tokens.accessTokenKey);
      await keytar.deletePassword(CONFIG.tokens.serviceName, CONFIG.tokens.refreshTokenKey);
      await keytar.deletePassword(CONFIG.tokens.serviceName, CONFIG.tokens.expiresAtKey);
      await keytar.deletePassword(CONFIG.tokens.serviceName, CONFIG.tokens.idTokenKey);
    } else {
      try {
        fs.unlinkSync(getStoragePath());
      } catch (e) {
        // File may not exist, ignore
      }
    }
  }

  // Fallback file storage methods
  private async setFallback(key: string, value: string): Promise<void> {
    const path = getStoragePath();
    const data: Record<string, string> = {};

    if (fs.existsSync(path)) {
      try {
        const content = await decrypt(fs.readFileSync(path, 'utf-8'));
        const [storedKey, storedValue] = content.split(':', 2);
        if (storedKey && storedValue) {
          data[storedKey] = storedValue;
        }
      } catch {
        // Corrupted file, start fresh
      }
    }

    data[key] = value;
    const entries = Object.entries(data);
    if (entries.length === 0) return;

    // Encrypt all entries as JSON
    const jsonStr = JSON.stringify(data);
    const encrypted = await encrypt(jsonStr, this.getUserSalt());
    fs.writeFileSync(path, encrypted, { mode: 0o600 });
  }

  private async getFallback(key: string): Promise<string | null> {
    const path = getStoragePath();
    if (!fs.existsSync(path)) {
      return null;
    }

    try {
      const encrypted = fs.readFileSync(path, 'utf-8');
      const decrypted = await decrypt(encrypted);
      const data = JSON.parse(decrypted);
      return data[key] || null;
    } catch {
      return null;
    }
  }

  private getUserSalt(): string {
    // Use OS-specific user information to derive salt
    const user = os.userInfo().username;
    const home = homedir();
    return `${user}-${home.length}-kvasar-cli`;
  }
}

export const tokenStore = new TokenStore();
