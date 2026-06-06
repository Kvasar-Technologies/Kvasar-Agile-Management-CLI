import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executePIsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getProgramIncrement(args.id);
  return { data };
}

export async function executePIsUpdate(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateProgramIncrement(args.id, body);
  return { data };
}

export async function executePIsDelete(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.deleteProgramIncrement(args.id);
  return { success: true };
}

export async function executePIsAddSprint(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.addSprint(args.id, body);
  return { data };
}

export const pisCommand = new Command('pis')
  .description('Manage Program Increments')
  .addCommand(new Command('get')
    .description('Get a PI by ID')
    .argument('<id>', 'Program Increment ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executePIsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a PI (PUT)')
    .argument('<id>', 'Program Increment ID')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executePIsUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete')
    .description('Delete a PI')
    .argument('<id>', 'Program Increment ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executePIsDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
  .addCommand(new Command('add-sprint')
    .description('Add a sprint to a PI')
    .argument('<id>', 'Program Increment ID')
    .option('--file <path>', 'JSON file with sprint data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executePIsAddSprint({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));
