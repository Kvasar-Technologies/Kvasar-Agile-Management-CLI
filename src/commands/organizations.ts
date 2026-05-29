import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeOrganizationsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getOrganization(args.id);
  return { data };
}

export async function executeOrganizationsUpdate(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateOrganization(args.id, body);
  return { data };
}

export async function executeOrganizationsDelete(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.deleteOrganization(args.id);
  return { success: true };
}

export async function executeOrganizationsPatch(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : [];
  const data = await client.patchOrganization(args.id, body);
  return { data };
}

export async function executeOrganizationsList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listOrganizations();
  return { data };
}

export const organizationsCommand = new Command('organizations')
  .description('Manage organizations')
  .addCommand(new Command('list')
    .description('List all organizations')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeOrganizationsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get <id>')
    .description('Get an organization by ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update <id>')
    .description('Update an organization (PUT)')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete <id>')
    .description('Delete an organization')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
  .addCommand(new Command('patch <id>')
    .description('Patch an organization (JSON Patch)')
    .option('--file <path>', 'JSON Patch file')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsPatch({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));
