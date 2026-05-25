import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';

// Execute functions
export async function executeUsersList(args: { output?: string; fields?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listUsers();
  return { data };
}

export async function executeUsersCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(require('fs').readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createUser(body);
  return { data };
}

export async function executeUsersUpdate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(require('fs').readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateUser(body);
  return { data };
}

// Command group
export const usersCommand = new Command('users')
  .description('Manage users')
  .addCommand(new Command('list')
    .description('List all users')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeUsersList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new user')
    .option('--file <path>', 'JSON file with user data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeUsersCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a user (PUT)')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeUsersUpdate(options);
      console.log(formatOutput(result.data, options));
    }));
