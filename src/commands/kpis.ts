import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';

export async function executeKPIsList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listKPIs();
  return { data };
}

export async function executeKPIsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(require('fs').readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createKPI(body);
  return { data };
}

export async function executeKPIsUpdate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(require('fs').readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateKPI(body);
  return { data };
}

export const kpisCommand = new Command('kpis')
  .description('Manage KPIs')
  .addCommand(new Command('list')
    .description('List all KPIs')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeKPIsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new KPI')
    .option('--file <path>', 'JSON file with KPI data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeKPIsCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a KPI (PUT)')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeKPIsUpdate(options);
      console.log(formatOutput(result.data, options));
    }));
