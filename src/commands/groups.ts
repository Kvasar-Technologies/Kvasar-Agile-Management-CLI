import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeGroupsList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listGroups();
  return { data };
}

export async function executeGroupsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createGroup(body);
  return { data };
}

export async function executeGroupsUpdate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateGroup(body);
  return { data };
}

export const groupsCommand = new Command('groups')
  .description('Manage groups (ARTs, Business Owners, etc.)')
  .addCommand(new Command('list')
    .description('List all groups')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeGroupsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new group')
    .option('--file <path>', 'JSON file with group data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeGroupsCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a group (PUT)')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeGroupsUpdate(options);
      console.log(formatOutput(result.data, options));
    }));
