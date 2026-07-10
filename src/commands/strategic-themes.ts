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

export async function executeStrategicThemesCreate(args: {
  name?: string;
  description?: string;
  organizationId?: string;
  ownerId?: string;
  strategicOwnerId?: string;
  portfolioId?: string;
  status?: string;
  code?: string;
  file?: string;
  output?: string;
  quiet?: boolean;
}): Promise<any> {
  const client = await getClient();
  let body: any = {};

  if (args.file) {
    body = JSON.parse(fs.readFileSync(args.file, 'utf-8'));
  }

  // Apply CLI flags on top of file-based body (CLI flags override file values)
  if (args.name) body.name = args.name;
  if (args.description) body.description = args.description;
  if (args.organizationId) body.organizationId = args.organizationId;
  if (args.ownerId) body.ownerId = args.ownerId;
  if (args.strategicOwnerId) body.strategicOwnerId = args.strategicOwnerId;
  if (args.portfolioId) body.portfolioId = args.portfolioId;
  if (args.status) body.status = args.status;
  if (args.code) body.code = args.code;

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
  .addCommand(new Command('get')
    .description('Get a strategic theme by ID')
    .argument('<id>', 'Strategic theme ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new strategic theme')
    .option('--name <name>', 'Strategic theme name')
    .option('--description <text>', 'Strategic theme description (required by API)')
    .option('--organization-id <id>', 'Organization ID (required by API)')
    .option('--owner-id <id>', 'Owner user ID (required by API)')
    .option('--strategic-owner-id <id>', 'Strategic owner user ID (required by API)')
    .option('--portfolio-id <id>', 'Portfolio ID')
    .option('--status <status>', 'Status')
    .option('--code <code>', 'Short code')
    .option('--file <path>', 'JSON file with strategic theme data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeStrategicThemesCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a strategic theme (PUT)')
    .argument('<id>', 'Strategic theme ID')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete')
    .description('Delete a strategic theme')
    .argument('<id>', 'Strategic theme ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
   .addCommand(new Command('patch')
     .description('Patch a strategic theme using JSON Patch (RFC 6902)\n\nAccepts either:\n- JSON Patch array: [{"op":"replace","path":"/name","value":"New"}]\n- Simple object (auto-converted): {"name":"New"}')
     .argument('<id>', 'Strategic theme ID')
     .option('--file <path>', 'JSON file with patch operations or simple object')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (id, options) => {
       const result = await executeStrategicThemesPatch({ id, ...options });
       console.log(formatOutput(result.data, options));
     }))
  .addCommand(new Command('add-keyresult')
    .description('Add a key result to a strategic theme')
    .argument('<id>', 'Strategic theme ID')
    .option('--file <path>', 'JSON file with key result data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesAddKeyResult({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-budget')
    .description('Add budget distribution to a strategic theme')
    .argument('<id>', 'Strategic theme ID')
    .option('--file <path>', 'JSON file with budget data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeStrategicThemesAddBudgetDistribution({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));
