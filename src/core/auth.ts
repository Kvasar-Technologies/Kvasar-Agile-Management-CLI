import { CONFIG, validateConfig } from './config.js';
import { tokenStore } from './token-store.js';
import { executeDeviceFlow, refreshAccessToken, TokenResponse } from '../auth0/device-flow.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresAt: number; // Unix timestamp in seconds
}

/**
 * Authentication Service
 * Manages login, logout, token refresh, and validity checks
 */
export class AuthService {
  private currentTokens: AuthTokens | null = null;
  private overrideToken: string | null = null;
  private initialized: boolean = false;

  constructor() {
    // Don't load tokens automatically; call initialize() explicitly
  }

  /**
   * Initialize the auth service by loading tokens from storage
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.loadTokensFromStorage();
    this.initialized = true;
  }

  /**
   * Load tokens from secure storage
   */
  private async loadTokensFromStorage(): Promise<void> {
    const accessToken = await tokenStore.getAccessToken();
    const refreshToken = await tokenStore.getRefreshToken();
    const expiresAt = await tokenStore.getExpiresAt();
    const idToken = await tokenStore.getIdToken();

    if (accessToken && expiresAt) {
      this.currentTokens = {
        accessToken,
        refreshToken: refreshToken || '',
        ...(idToken && { idToken }),
        expiresAt,
      };
    }
  }

  /**
   * Check if we have valid (non-expired) tokens
   */
  isAuthenticated(): boolean {
    if (this.overrideToken) {
      return true; // Override token is always considered authenticated
    }
    if (!this.currentTokens) {
      return false;
    }
    // Consider token expired if less than 60 seconds remaining
    const now = Math.floor(Date.now() / 1000);
    return this.currentTokens.expiresAt > now + 60;
  }

  /**
   * Set an access token override (for --access-token flag)
   */
  setOverrideToken(token: string): void {
    this.overrideToken = token;
  }

  /**
   * Clear the access token override
   */
  clearOverrideToken(): void {
    this.overrideToken = null;
  }

  /**
   * Get current access token, refreshing if needed
   */
  async getAccessToken(): Promise<string> {
    if (this.overrideToken) {
      return this.overrideToken;
    }
    if (!this.isAuthenticated()) {
      if (this.currentTokens?.refreshToken) {
        // Try to refresh
        await this.refresh();
      } else {
        throw new Error('Not authenticated. Run `kvasar login` first.');
      }
    }

    return this.currentTokens!.accessToken;
  }

  /**
   * Login using Auth0 Device Flow
   */
  async login(): Promise<void> {
    const validation = validateConfig();
    if (!validation.valid) {
      throw new Error(`Configuration error: ${validation.errors.join(', ')}`);
    }

    console.log('Starting authentication...');

    try {
      const tokens = await executeDeviceFlow(async (verificationUri, userCode) => {
        console.log('');
        console.log('┌─────────────────────────────────────────────────────┐');
        console.log('│               Kvasar Authentication                │');
        console.log('├─────────────────────────────────────────────────────┤');
        console.log(`│  Browser: ${verificationUri.padEnd(44)} │`);
        console.log(`│  Code:    ${userCode.padEnd(44)} │`);
        console.log('└─────────────────────────────────────────────────────┘');
        console.log('Press Enter after completing authentication in browser...');

        // Wait for user to press Enter (optional)
        await new Promise<void>((resolve) => {
          process.stdin.once('data', resolve);
        });
      });

      await this.storeTokens(tokens);
      console.log('✓ Authentication successful!');
    } catch (error: any) {
      console.error('Authentication failed:', error.message);
      throw error;
    }
  }

  /**
   * Logout - clear all stored tokens
   */
  async logout(): Promise<void> {
    await tokenStore.clearAll();
    this.currentTokens = null;
    console.log('✓ Logged out successfully');
  }

  /**
   * Display current user info based on ID token
   */
  async whoami(): Promise<Record<string, unknown> | null> {
    const idToken = this.currentTokens?.idToken;
    if (!idToken) {
      return null;
    }

    try {
      // Decode JWT without verification (just for display)
      const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      return {
        email: payload.email,
        name: payload.name,
        sub: payload.sub,
        'https://api.kvasar.io/org_id': payload['https://api.kvasar.io/org_id'],
      };
    } catch {
      return { rawToken: idToken };
    }
  }

  /**
   * Store tokens after successful authentication
   */
  private async storeTokens(tokens: TokenResponse): Promise<void> {
    const expiresAt = Math.floor(Date.now() / 1000) + tokens.expires_in;

    await tokenStore.setAccessToken(tokens.access_token);
    await tokenStore.setRefreshToken(tokens.refresh_token || '');
    await tokenStore.setExpiresAt(expiresAt);

    if (tokens.id_token) {
      await tokenStore.setIdToken(tokens.id_token);
    }

    this.currentTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      ...(tokens.id_token && { idToken: tokens.id_token }),
      expiresAt,
    };
  }

  /**
   * Refresh the access token using refresh token
   */
  private async refresh(): Promise<void> {
    if (!this.currentTokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const tokens = await refreshAccessToken(this.currentTokens.refreshToken);
      await this.storeTokens(tokens);
    } catch (error: any) {
      // Refresh failed, clear tokens
      await this.logout();
      throw new Error('Session expired. Please run `kvasar login` again.');
    }
  }
}

export const authService = new AuthService();

/**
 * Resolve access token for MCP server and other consumers
 */
export async function resolveAccessToken(): Promise<string> {
  if (!authService.isAuthenticated()) {
    throw new Error('Not authenticated. Run `kvasar login` first.');
  }
  return await authService.getAccessToken();
}
