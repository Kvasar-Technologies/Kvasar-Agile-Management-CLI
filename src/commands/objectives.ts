import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeObjectivesList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listObjectives();
  return { data };
}

export async function executeObjectivesGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getObjective(args.id);
  return { data };
}

export async function executeObjectivesCreate(args: {
  name?: string;
  strategicThemeId?: string;
  strategicThemeKey?: string;
  programIncrementId?: string;
  ownerId?: string;
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
  if (args.strategicThemeId) body.strategicThemeId = args.strategicThemeId;
  if (args.strategicThemeKey) body.strategicThemeKey = args.strategicThemeKey;
  if (args.programIncrementId) body.programIncrementId = args.programIncrementId;
  if (args.ownerId) body.ownerId = args.ownerId;

  const data = await client.createObjective(body);
  return { data };
}

export async function executeObjectivesUpdate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateObjective(body);
  return { data };
}

export async function executeObjectivesDelete(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  await client.deleteObjective(args.id);
  return { success: true };
}

export const objectivesCommand = new Command('objectives')
  .description('Manage objectives')
  .addCommand(new Command('list')
    .description('List all objectives')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeObjectivesList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get')
    .description('Get an objective by ID')
    .argument('<id>', 'Objective ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeObjectivesGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description(`Create a new objective

Required fields:
- name: Objective name (required)
- strategic-theme-id or strategic-theme-key: Strategic theme ID or key (e.g. ST-1)

Optional fields:
- program-increment-id: PI ID
- owner-id: Owner user ID

Examples:
  kvasar objectives create --name "Increase NPS by 20%" --strategic-theme-key ST-1
  kvasar objectives create --name "Reduce Churn Rate" --strategic-theme-id 123abc --owner-id user456`)
    .option('--name <name>', 'Objective name (required)')
    .option('--strategic-theme-id <id>', 'Strategic theme ID')
    .option('--strategic-theme-key <key>', 'Strategic theme key (e.g. ST-1)')
    .option('--program-increment-id <id>', 'Program increment ID')
    .option('--owner-id <id>', 'Owner user ID')
    .option('--file <path>', 'JSON file with objective data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeObjectivesCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update objectives')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeObjectivesUpdate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete')
    .description('Delete an objective')
    .argument('<id>', 'Objective ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeObjectivesDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }));
