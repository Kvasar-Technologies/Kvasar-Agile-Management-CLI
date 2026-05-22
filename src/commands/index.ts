import { Command } from 'commander';
import { loginCommand } from './auth/login.js';
import { logoutCommand } from './auth/logout.js';
import { whoamiCommand } from './auth/whoami.js';
import { authService } from '../core/auth.js';

// Callable function imports for MCP
import { executeLogin } from './auth/login.js';
import { executeLogout } from './auth/logout.js';
import { executeWhoami } from './auth/whoami.js';

/**
 * Register all CLI commands
 */
export function registerAllCommands(program: Command): void {
  // Auth commands as top-level
  program.addCommand(loginCommand);
  program.addCommand(logoutCommand);
  program.addCommand(whoamiCommand);
}

/**
 * MCP Tool definitions
 * These allow independent execution without Commander
 */
export const allCommands: Array<{
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: Record<string, unknown>, client: any) => Promise<any>;
}> = [
  {
    name: 'login',
    description: 'Authenticate with Kvasar using browser-based OAuth',
    inputSchema: {
      type: 'object',
      properties: {
        force: { type: 'boolean' }
      }
    },
    handler: async (args, client) => {
      const force = args.force as boolean | undefined;
      if (!force && authService.isAuthenticated()) {
        const user = await authService.whoami();
        return {
          success: false,
          message: 'Already authenticated',
          user
        };
      }
      await executeLogin({ force });
      const user = await authService.whoami();
      return { success: true, user };
    }
  },
  {
    name: 'logout',
    description: 'Log out and clear stored credentials',
    inputSchema: {
      type: 'object',
      properties: {
        keepTokens: { type: 'boolean' }
      }
    },
    handler: async (args, client) => {
      const keepTokens = args.keepTokens as boolean | undefined;
      await executeLogout({ keepTokens });
      return { success: true };
    }
  },
  {
    name: 'whoami',
    description: 'Display information about the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {
        json: { type: 'boolean' }
      }
    },
    handler: async (args, client) => {
      const result = await executeWhoami();
      return result;
    }
  },
];
