import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeItemsList(args: { numeration?: string; parentId?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listItems({ numeration: args.numeration, parentId: args.parentId });
  return { data };
}

export async function executeItemsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getItem(args.id);
  return { data };
}

export async function executeItemsUpdate(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateItem(args.id, body);
  return { data };
}

export async function executeItemsDelete(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.deleteItem(args.id);
  return { success: true };
}

export async function executeItemsPatch(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : [];
  const data = await client.patchItem(args.id, body);
  return { data };
}

export async function executeItemsAddRelation(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.addItemRelation(args.id, body);
  return { data };
}

export const itemsCommand = new Command('items')
  .description('Manage items (capabilities, defects, epics, features, stories, etc.)')
  .addCommand(new Command('list')
    .description('List items')
    .option('--numeration <numeration>', 'Filter by numeration')
    .option('--parentId <parentId>', 'Filter by parent ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeItemsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get <id>')
    .description('Get an item by ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update <id>')
    .description('Update an item (PUT)')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete <id>')
    .description('Delete an item')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
  .addCommand(new Command('patch <id>')
    .description('Patch an item (JSON Patch)')
    .option('--file <path>', 'JSON Patch file')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsPatch({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-relation <id>')
    .description('Add a relation to an item')
    .option('--file <path>', 'JSON file with relation data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsAddRelation({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));
