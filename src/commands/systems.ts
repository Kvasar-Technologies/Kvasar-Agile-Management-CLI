import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeSystemsList(args: { 
  output?: string; 
  quiet?: boolean;
  organizationId?: string;
  customerType?: string;
  contextType?: string;
  solutionManagerId?: string;
}): Promise<any> {
  const client = await getClient();
  const data = await client.listSolutionsByType('system', {
    organizationId: args.organizationId,
    customerType: args.customerType,
    contextType: args.contextType,
    solutionManagerId: args.solutionManagerId,
  });
  return { data };
}

export async function executeSystemsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getSolution(args.id);
  return { data };
}

export async function executeSystemsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createSolution({ ...body, type: 'system' });
  return { data };
}

export const systemsCommand = new Command('systems')
  .description('Manage systems (a type of solution)')
  .addCommand(new Command('list')
    .description('List all systems')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .option('--organizationId <id>', 'Filter by organization ID')
    .option('--customerType <type>', 'Filter by customer type (e.g., external, internal)')
    .option('--contextType <type>', 'Filter by context type (e.g., business, supporting/enabling)')
    .option('--solutionManagerId <id>', 'Filter by solution manager ID')
    .action(async (options) => {
      const result = await executeSystemsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get <id>')
    .description('Get a system by ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeSystemsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new system')
    .option('--file <path>', 'JSON file with system data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeSystemsCreate(options);
      console.log(formatOutput(result.data, options));
    }));
