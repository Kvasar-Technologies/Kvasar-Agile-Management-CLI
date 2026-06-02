import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeItemsList(args: { parentId?: string; page?: string; size?: string; sort?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const page = args.page !== undefined ? parseInt(args.page, 10) : undefined;
  const size = args.size !== undefined ? parseInt(args.size, 10) : undefined;
  const data = await client.listItems({
    parentId: args.parentId,
    page,
    size,
    sort: args.sort
  });
  return { data };
}

export async function executeItemsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getItem(args.id);
  return { data };
}

export async function executeItemsGetByKey(args: { key: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getItemByKey(args.key);
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

export async function executeItemsChildren(args: { parentId: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getChildren(args.parentId);
  return { data };
}

export const itemsCommand = new Command('items')
  .description('Manage items (capabilities, defects, epics, features, stories, etc.)')
  .addCommand(new Command('list')
    .description('List items')
    .option('--numeration <numeration>', 'Filter by numeration')
     .option('--parentId <parentId>', 'Filter by parent ID')
     .option('--page <page>', 'Page number (0-based)')
     .option('--size <size>', 'Page size')
     .option('--sort <sort>', 'Sorting criteria (e.g., field:direction)')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeItemsList(options);
      console.log(formatOutput(result.data, options));
     }))
    .addCommand(new Command('children')
      .description('Get children of an item')
      .argument('<parentId>', 'Parent item ID')
      .option('--output <format>', 'Output format: json or pretty', 'json')
      .option('--quiet', 'Suppress output')
      .action(async (parentId, options) => {
        const result = await executeItemsChildren({ parentId, ...options });
        console.log(formatOutput(result.data, options));
      }))
    .addCommand(new Command('get')
     .description('Get an item by ID')
     .argument('<id>', 'Item ID')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (id, options) => {
       const result = await executeItemsGet({ id, ...options });
       console.log(formatOutput(result.data, options));
     }))
   .addCommand(new Command('get-by-key')
     .description('Get an item by key')
     .argument('<key>', 'Item key')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (key, options) => {
       const result = await executeItemsGetByKey({ key, ...options });
       console.log(formatOutput(result.data, options));
     }))
   .addCommand(new Command('update')
    .description('Update an item (PUT)')
    .argument('<id>', 'Item ID')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete')
    .description('Delete an item')
    .argument('<id>', 'Item ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
  .addCommand(new Command('patch')
    .description('Patch an item (JSON Patch)')
    .argument('<id>', 'Item ID')
    .option('--file <path>', 'JSON Patch file')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsPatch({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-relation')
    .description('Add a relation to an item')
    .argument('<id>', 'Item ID')
    .option('--file <path>', 'JSON file with relation data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeItemsAddRelation({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));


