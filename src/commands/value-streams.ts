import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

/**
 * Execute list value streams
 */
export async function executeValueStreamsList(args: { output?: string; fields?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listValueStreams();
  return { data };
}

/**
 * Execute get value stream
 */
export async function executeValueStreamsGet(args: { id: string; output?: string; fields?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.getValueStream(args.id);
  return { data };
}

/**
 * Execute create value stream
 */
export async function executeValueStreamsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createValueStream(body);
  return { data };
}

/**
 * Execute update value stream (PUT)
 */
export async function executeValueStreamsUpdate(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateValueStream(args.id, body);
  return { data };
}

/**
 * Execute delete value stream
 */
export async function executeValueStreamsDelete(args: { id: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.deleteValueStream(args.id);
  return { success: true };
}

/**
 * Execute patch value stream
 */
export async function executeValueStreamsPatch(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : [];
  const data = await client.patchValueStream(args.id, body);
  return { data };
}

/**
 * Execute update stages
 */
export async function executeValueStreamsStages(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : [];
  const data = await client.updateStages(args.id, body);
  return { data };
}

/**
 * Execute add stage
 */
export async function executeValueStreamsAddStage(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.addStage(args.id, body);
  return { data };
}

/**
 * Execute add solutions
 */
export async function executeValueStreamsAddSolutions(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : [];
  const data = await client.addSolutions(args.id, body);
  return { data };
}

/**
 * Execute add art
 */
export async function executeValueStreamsAddArt(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.addArt(args.id, body);
  return { data };
}

/**
 * Execute copy value stream
 */
export async function executeValueStreamsCopy(args: { id: string; file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.copyValueStream(args.id, body);
  return { data };
}

// Command definitions
export const valueStreamsCommand = new Command('value-streams')
  .description('Manage value streams')
  .addCommand(new Command('list')
    .description('List all value streams')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeValueStreamsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('get')
    .description('Get a value stream by ID')
    .argument('<id>', 'Value stream ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsGet({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new value stream')
    .option('--file <path>', 'JSON file with value stream data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeValueStreamsCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a value stream (PUT)')
    .argument('<id>', 'Value stream ID')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsUpdate({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('delete')
    .description('Delete a value stream')
    .argument('<id>', 'Value stream ID')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsDelete({ id, ...options });
      if (!options.quiet) {
        console.log(formatOutput(result, options));
      }
    }))
  .addCommand(new Command('patch')
    .description('Patch a value stream (JSON Patch)')
    .argument('<id>', 'Value stream ID')
    .option('--file <path>', 'JSON Patch file')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsPatch({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('stages')
    .description('Update all stages of a value stream')
    .argument('<id>', 'Value stream ID')
    .option('--file <path>', 'JSON file with stages array')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsStages({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-stage')
    .description('Add a stage to a value stream')
    .argument('<id>', 'Value stream ID')
    .option('--file <path>', 'JSON file with stage data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsAddStage({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-solutions')
    .description('Add solutions to a value stream')
    .argument('<id>', 'Value stream ID')
    .option('--file <path>', 'JSON file with solution IDs array')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsAddSolutions({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('add-art')
    .description('Add an ART to a value stream')
    .argument('<id>', 'Value stream ID')
    .option('--file <path>', 'JSON file with ART data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsAddArt({ id, ...options });
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('copy')
    .description('Copy a value stream')
    .argument('<id>', 'Value stream ID')
    .option('--file <path>', 'JSON file with copy configuration')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (id, options) => {
      const result = await executeValueStreamsCopy({ id, ...options });
      console.log(formatOutput(result.data, options));
    }));

