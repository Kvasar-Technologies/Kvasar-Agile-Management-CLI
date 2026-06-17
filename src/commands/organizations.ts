import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeOrganizationsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getOrganization(args.id);
  return { data };
}

export async function executeOrganizationsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createOrganization(body);
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
  let body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : [];

  // Convert simple object to JSON Patch array with replace operations
  if (!Array.isArray(body)) {
    const patchOps = [];
    for (const [key, value] of Object.entries(body)) {
      patchOps.push({
        op: 'replace',
        path: `/${key}`,
        value: value
      });
    }
    body = patchOps;
  }

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
  .addCommand(new Command('create')
    .description('Create an organization')
    .option('--file <path>', 'JSON file with organization data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeOrganizationsCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get')
    .description('Get an organization by ID')
    .argument('<id>', 'Organization ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update an organization (PUT)')
    .argument('<id>', 'Organization ID')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete')
    .description('Delete an organization')
    .argument('<id>', 'Organization ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
  .addCommand(new Command('patch')
    .description('Patch an organization using JSON Patch (RFC 6902)\n\nAccepts either:\n- JSON Patch array: [{"op":"replace","path":"/name","value":"New"}]\n- Simple object (auto-converted): {"name":"New"}')
    .argument('<id>', 'Organization ID')
    .option('--file <path>', 'JSON file with patch operations or simple object')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeOrganizationsPatch({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));
