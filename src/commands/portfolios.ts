import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executePortfoliosList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listPortfolios();
  return { data };
}

export async function executePortfoliosCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createPortfolio(body);
  return { data };
}

export async function executePortfoliosUpdate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updatePortfolio(body);
  return { data };
}

export const portfoliosCommand = new Command('portfolios')
  .description('Manage portfolios')
  .addCommand(new Command('list')
    .description('List all portfolios')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executePortfoliosList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new portfolio')
    .option('--file <path>', 'JSON file with portfolio data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executePortfoliosCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a portfolio')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executePortfoliosUpdate(options);
      console.log(formatOutput(result.data, options));
    }));
