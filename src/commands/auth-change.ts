import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';

export async function executeChangePassword(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(require('fs').readFileSync(args.file, 'utf-8')) : {};
  const data = await client.changePassword(body);
  return { data };
}

export async function executeChangeName(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(require('fs').readFileSync(args.file, 'utf-8')) : {};
  const data = await client.changeName(body);
  return { data };
}

export const authChangeCommand = new Command('auth-change')
  .description('User account management')
  .addCommand(new Command('password')
    .description('Change password')
    .option('--file <path>', 'JSON file with change password data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeChangePassword(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('name')
    .description('Change user name')
    .option('--file <path>', 'JSON file with change name data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeChangeName(options);
      console.log(formatOutput(result.data, options));
    }));
