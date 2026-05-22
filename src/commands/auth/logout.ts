import { Command } from 'commander';
import { authService } from '../../core/auth.js';
import { tokenStore } from '../../core/token-store.js';

/**
 * Execute logout operation (used by both CLI and MCP)
 */
export async function executeLogout(options: { keepTokens?: boolean }): Promise<{ success: boolean }> {
  if (!options.keepTokens) {
    await tokenStore.clearAll();
  }
  authService['currentTokens'] = null; // clear internal state
  authService['overrideToken'] = null;
  return { success: true };
}

export const logoutCommand = new Command('logout')
  .description('Log out and clear stored credentials')
  .option('--keep-tokens', 'Do not delete tokens (only clear memory)')
  .action(async (options) => {
    try {
      await executeLogout({ keepTokens: options.keepTokens });
      console.log('✓ Logged out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error.message);
      process.exit(1);
    }
  });
