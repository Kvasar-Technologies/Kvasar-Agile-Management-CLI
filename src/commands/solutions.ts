import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

export async function executeSolutionsList(args: { output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listSolutions();
  return { data };
}

export async function executeSolutionsGet(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getSolution(args.id);
  return { data };
}

export async function executeSolutionsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createSolution(body);
  return { data };
}

export async function executeSolutionsUpdate(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateSolution(args.id, body);
  return { data };
}

export async function executeSolutionsDelete(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.deleteSolution(args.id);
  return { success: true };
}

export async function executeSolutionsPatch(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
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

  const data = await client.patchSolution(args.id, body);
  return { data };
}

export async function executeSolutionsAddRelation(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.addRelation(args.id, body);
  return { data };
}

export const solutionsCommand = new Command('solutions')
  .description('Manage solutions')
  .addCommand(new Command('list')
    .description('List all solutions')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeSolutionsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get')
    .description('Get a solution by ID')
    .argument('<id>', 'Solution ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeSolutionsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new solution')
    .option('--file <path>', 'JSON file with solution data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeSolutionsCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a solution (PUT)')
    .argument('<id>', 'Solution ID')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeSolutionsUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete')
    .description('Delete a solution')
    .argument('<id>', 'Solution ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeSolutionsDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
   .addCommand(new Command('patch')
     .description('Patch a solution using JSON Patch (RFC 6902)\n\nAccepts either:\n- JSON Patch array: [{"op":"replace","path":"/name","value":"New"}]\n- Simple object (auto-converted): {"name":"New"}')
     .argument('<id>', 'Solution ID')
     .option('--file <path>', 'JSON file with patch operations or simple object')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (id, options) => {
       const result = await executeSolutionsPatch({ id, ...options });
       console.log(formatOutput(result.data, options));
     }))
  .addCommand(new Command('add-relation')
    .description('Add a relation to a solution')
    .argument('<id>', 'Solution ID')
    .option('--file <path>', 'JSON file with relation data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeSolutionsAddRelation({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));
