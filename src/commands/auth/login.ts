import { Command } from 'commander';
import { authService } from '../../core/auth.js';

/**
 * Execute login operation (used by both CLI and MCP)
 */
export async function executeLogin(options: { force?: boolean }): Promise<{ success: boolean; user?: any; message?: string }> {
  // Check if already authenticated (unless forced)
  if (!options.force && authService.isAuthenticated()) {
    const user = await authService.whoami();
    return {
      success: false,
      message: 'Already authenticated',
      user
    };
  }

  try {
    // Perform login
    await authService.login();

    // Show logged in user
    const user = await authService.whoami();
    return {
      success: true,
      user
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
}

export const loginCommand = new Command('login')
  .description('Authenticate with Kvasar using browser-based OAuth')
  .option('--force', 'Force re-authentication even if already logged in')
  .action(async (options) => {
    const result = await executeLogin({ force: options.force });
    if (result.success) {
      if (result.user?.email) {
        console.log(`Welcome, ${result.user.name || result.user.email}!`);
      }
    } else {
      if (result.user?.email) {
        console.log('Already authenticated.');
        console.log(`Currently logged in as: ${result.user.email}`);
      } else {
        console.log(result.message || 'Login failed');
        process.exit(1);
      }
    }
  });
