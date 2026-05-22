import { loginCommand } from './login.js';
import { logoutCommand } from './logout.js';
import { whoamiCommand } from './whoami.js';

/**
 * Auth subcommand group
 * These commands manage authentication and user identity
 */
export const authCommands = [loginCommand, logoutCommand, whoamiCommand];

/**
 * Register all auth commands to a parent command
 */
export function registerAuthCommands(program: any): void {
  const auth = program.command('auth', 'Authentication commands');
  for (const cmd of authCommands) {
    auth.addCommand(cmd);
  }
}
