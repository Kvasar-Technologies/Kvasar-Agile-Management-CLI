import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeServicesList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listSolutionsByType('service');
  return { data };
}

export async function executeServicesGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getSolution(args.id);
  return { data };
}

export async function executeServicesCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createSolution({ ...body, type: 'service' });
  return { data };
}

export const servicesCommand = new Command('services')
  .description('Manage services (a type of solution)')
  .addCommand(new Command('list')
    .description('List all services')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeServicesList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get <id>')
    .description('Get a service by ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeServicesGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new service')
    .option('--file <path>', 'JSON file with service data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeServicesCreate(options);
      console.log(formatOutput(result.data, options));
    }));
