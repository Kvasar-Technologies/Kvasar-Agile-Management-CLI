import { Command } from 'commander';
import { registerAllCommands } from './commands/index.js';
import { authService } from './core/auth.js';

const program = new Command();

program
  .name('kvasar')
  .description(
    'AI-native CLI and MCP server for Kvasar Agile Management'
  )
  .version('0.1.0')
  .option(
    '--access-token <token>',
    'Access token (overrides KVASAR_API_TOKEN env var and stored config)'
  )
  .option(
    '--output <format>',
    'Output format: json (default) or pretty',
    'json'
  )
  .option(
    '--pretty',
    'Shorthand for --output pretty'
  )
  .option(
    '--quiet',
    'Suppress output, exit codes only'
  )
  .option(
    '--fields <fields>',
    'Comma-separated list of fields to include in output'
  );

registerAllCommands(program);

async function main() {
  // Initialize auth: load tokens from storage before parsing
  await authService.initialize();

  // Set up access token override if provided via option
  program.on('option:accessToken', (token: string) => {
    authService.setOverrideToken(token);
  });

  try {
    // Parse arguments and execute command
    await program.parseAsync();
    process.exit(0);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
