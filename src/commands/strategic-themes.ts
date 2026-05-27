import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeStrategicThemesList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listStrategicThemes();
  return { data };
}

export async function executeStrategicThemesGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getStrategicTheme(args.id);
  return { data };
}

export async function executeStrategicThemesCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createStrategicTheme(body);
  return { data };
}

export async function executeStrategicThemesUpdate(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateStrategicTheme(args.id, body);
  return { data };
}

export async function executeStrategicThemesDelete(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.deleteStrategicTheme(args.id);
  return { success: true };
}

export async function executeStrategicThemesPatch(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : [];
  const data = await client.patchStrategicTheme(args.id, body);
  return { data };
}

export async function executeStrategicThemesAddKeyResult(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.addKeyResult(args.id, body);
  return { data };
}

export async function executeStrategicThemesAddBudgetDistribution(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.addBudgetDistribution(args.id, body);
  return { data };
}

export const strategicThemesCommand = new Command('strategic-themes')
  .description('Manage strategic themes')
  .addCommand(new Command('list')
    .description('List all strategic themes')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeStrategicThemesList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get <id>')
    .description('Get a strategic theme by ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new strategic theme')
    .option('--file <path>', 'JSON file with strategic theme data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeStrategicThemesCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update <id>')
    .description('Update a strategic theme (PUT)')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete <id>')
    .description('Delete a strategic theme')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
  .addCommand(new Command('patch <id>')
    .description('Patch a strategic theme (JSON Patch)')
    .option('--file <path>', 'JSON Patch file')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesPatch({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-keyresult <id>')
    .description('Add a key result to a strategic theme')
    .option('--file <path>', 'JSON file with key result data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesAddKeyResult({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-budget <id>')
    .description('Add budget distribution to a strategic theme')
    .option('--file <path>', 'JSON file with budget data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesAddBudgetDistribution({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));
