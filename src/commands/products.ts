import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeProductsList(args: { 
  output?: string; 
  quiet?: boolean;
  organizationId?: string;
  customerType?: string;
  contextType?: string;
  solutionManagerId?: string;
}): Promise<any> {
  const client = await getClient();
  const data = await client.listSolutionsByType('product', {
    organizationId: args.organizationId,
    customerType: args.customerType,
    contextType: args.contextType,
    solutionManagerId: args.solutionManagerId,
  });
  return { data };
}

export async function executeProductsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getSolution(args.id);
  return { data };
}

export async function executeProductsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createSolution({ ...body, type: 'product' });
  return { data };
}

export const productsCommand = new Command('products')
  .description('Manage products (a type of solution)')
  .addCommand(new Command('list')
    .description('List all products')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .option('--organizationId <id>', 'Filter by organization ID')
    .option('--customerType <type>', 'Filter by customer type (e.g., external, internal)')
    .option('--contextType <type>', 'Filter by context type (e.g., business, supporting/enabling)')
    .option('--solutionManagerId <id>', 'Filter by solution manager ID')
    .action(async (options) => {
      const result = await executeProductsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get')
    .description('Get a product by ID')
    .argument('<id>', 'Product ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeProductsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new product')
    .option('--file <path>', 'JSON file with product data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeProductsCreate(options);
      console.log(formatOutput(result.data, options));
    }));
