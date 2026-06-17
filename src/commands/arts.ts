import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeARTsList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listARTs();
  return { data };
}

export async function executeARTsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createART(body);
  return { data };
}

export async function executeARTsUpdate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateART(body);
  return { data };
}

export async function executeARTsAssign(args: { feature: string; art: string; status: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = { featureKey: args.feature, status: args.status };
  const data = await client.assignFeatureToArt(args.art, body);
  return { data };
}

export const artsCommand = new Command('arts')
  .description('Manage Agile Release Trains (ARTs)')
  .addCommand(new Command('list')
    .description('List all ARTs')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeARTsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new ART')
    .option('--file <path>', 'JSON file with ART data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeARTsCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update an ART')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeARTsUpdate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('assign')
    .description('Assign a feature to an ART')
    .requiredOption('--feature <key>', 'Feature key (e.g. KV-101)')
    .requiredOption('--art <key>', 'ART key (e.g. ART-1)')
    .requiredOption('--status <status>', 'Status for the assignment (e.g. "In Progress")')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeARTsAssign(options);
      console.log(formatOutput(result.data, options));
    }));
