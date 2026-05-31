import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeServicesList(args: { 
  output?: string; 
  quiet?: boolean;
  organizationId?: string;
  customerType?: string;
  contextType?: string;
  solutionManagerId?: string;
}): Promise<any> {
  const client = await getClient();
  const data = await client.listSolutionsByType('service', {
    organizationId: args.organizationId,
    customerType: args.customerType,
    contextType: args.contextType,
    solutionManagerId: args.solutionManagerId,
  });
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
    .option('--organizationId <id>', 'Filter by organization ID')
    .option('--customerType <type>', 'Filter by customer type (e.g., external, internal)')
    .option('--contextType <type>', 'Filter by context type (e.g., business, supporting/enabling)')
    .option('--solutionManagerId <id>', 'Filter by solution manager ID')
    .action(async (options) => {
      const result = await executeServicesList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get')
    .description('Get a service by ID')
    .argument('<id>', 'Service ID')
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
