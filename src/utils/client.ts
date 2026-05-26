import { KvasarClient } from '../core/client.js';
import { authService } from '../core/auth.js';

/**
 * Get an authenticated KvasarClient instance
 */
export async function getClient(): Promise<KvasarClient> {
  const token = await authService.getAccessToken();
  return new KvasarClient(token);
}
