import { CONFIG } from '../core/config.js';

/**
 * Auth0 Device Authorization Flow implementation
 * Ref: https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow
 */

export interface DeviceFlowResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
}

/**
 * Request device authorization from Auth0
 */
export async function requestDeviceAuthorization(): Promise<DeviceFlowResponse> {
  const auth0Domain = CONFIG.auth0.domain.replace(/\/$/, '');
  const url = `${auth0Domain}/oauth/device/code`;

  const params = new URLSearchParams({
    client_id: CONFIG.auth0.clientId,
    audience: CONFIG.auth0.audience,
    scope: 'openid profile email offline_access',
  });

  const response = await fetch(url, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to request device code: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Poll for token using device code
 */
export async function pollForToken(
  deviceCode: string,
  signal?: AbortSignal
): Promise<TokenResponse> {
  const auth0Domain = CONFIG.auth0.domain.replace(/\/$/, '');
  const url = `${auth0Domain}/oauth/token`;

  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    device_code: deviceCode,
    client_id: CONFIG.auth0.clientId,
  });

  // Use interval from config but allow override
  const pollInterval = CONFIG.deviceFlow.pollIntervalMs;

  while (true) {
    if (signal?.aborted) {
      throw new Error('Authentication cancelled');
    }

    const response = await fetch(url, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data as TokenResponse;
    }

    // Auth0 error codes: authorization_pending, slow_down, access_denied, expired_token
    switch (data.error) {
      case 'authorization_pending':
        // Continue polling
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        continue;

      case 'slow_down':
        // Slow down polling
        await new Promise(resolve => setTimeout(resolve, pollInterval * 2));
        continue;

      case 'access_denied':
        throw new Error('Authentication denied by user');

      case 'expired_token':
        throw new Error('Device code expired. Please try again.');

      default:
        throw new Error(`Authentication failed: ${data.error_description || data.error}`);
    }
  }
}

/**
 * Execute the full device flow and return tokens
 */
export async function executeDeviceFlow(
  onUserAction?: (verificationUri: string, userCode: string) => Promise<void>,
  signal?: AbortSignal
): Promise<TokenResponse> {
  const deviceData = await requestDeviceAuthorization();

  // Notify user what to do
  if (onUserAction) {
    await onUserAction(deviceData.verification_uri, deviceData.user_code);
  } else {
    console.log('Please authenticate in your browser:');
    console.log(`1. Open: ${deviceData.verification_uri}`);
    console.log(`2. Enter code: ${deviceData.user_code}`);
    console.log('');
    console.log('Waiting for authentication...');
  }

  // Poll for token with timeout
  const timeoutMs = CONFIG.deviceFlow.pollTimeoutMs;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error('Authentication timeout: User did not complete within 60 minutes'));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([pollForToken(deviceData.device_code, signal), timeoutPromise]);
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    return result;
  } catch (error: any) {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    throw error;
  }
}

/**
 * Refresh an access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const auth0Domain = CONFIG.auth0.domain.replace(/\/$/, '');
  const url = `${auth0Domain}/oauth/token`;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CONFIG.auth0.clientId,
    audience: CONFIG.auth0.audience,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
  }

  return await response.json();
}
