import { Command } from 'commander';
import fs from 'fs';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';

export async function executeTeamMembersList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listTeamMembers();
  return { data };
}

export async function executeTeamMembersCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createTeamMember(body);
  return { data };
}

export const teammembersCommand = new Command('teammembers')
  .description('Manage team members')
  .addCommand(new Command('list')
    .description('List all team members')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeTeamMembersList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new team member')
    .option('--file <path>', 'JSON file with team member data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeTeamMembersCreate(options);
      console.log(formatOutput(result.data, options));
    }));
