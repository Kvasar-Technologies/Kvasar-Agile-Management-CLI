/**
 * Kvasar CLI Configuration
 * Centralized configuration for Auth0 and API endpoints
 */

export const CONFIG = {
  // Auth0 Configuration
  auth0: {
    domain: process.env.AUTH0_DOMAIN || 'https://kvasar-pro.eu.auth0.com',
    audience: process.env.AUTH0_AUDIENCE || 'https://api.kvasar.tech/api/v1/',
    clientId: process.env.AUTH0_CLIENT_ID || 'TJAjLrdPvFPDBqtSr15fvIer15Ocl9EI',
    // Native application - no client secret needed for device flow
  },

  // Kvasar API Configuration
  api: {
    baseUrl: process.env.KVASAR_API_URL || 'https://api.kvasar.tech',
    // Optional API versioning
    apiVersion: 'v1',
  },

  // Token storage configuration
  tokens: {
    serviceName: 'kvasar-cli',
    accessTokenKey: 'kvasar-access-token',
    refreshTokenKey: 'kvasar-refresh-token',
    expiresAtKey: 'kvasar-token-expires-at',
    idTokenKey: 'kvasar-id-token',
  },

  // Device flow polling configuration
  deviceFlow: {
    pollIntervalMs: 5000, // Poll every 5 seconds
    pollTimeoutMs: 60 * 60 * 1000, // 60 minutes max wait
  },
};

// Validation
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!CONFIG.auth0.clientId || CONFIG.auth0.clientId === 'YOUR_CLIENT_ID') {
    errors.push('AUTH0_CLIENT_ID environment variable must be set');
  }

  if (!CONFIG.auth0.audience) {
    errors.push('AUTH0_AUDIENCE environment variable must be set');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
