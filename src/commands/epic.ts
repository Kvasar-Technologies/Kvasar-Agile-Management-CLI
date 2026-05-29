import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

/**
 * Execute create epic
 */
export async function executeEpicCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createEpic(body);
  return { data };
}

/**
 * Command group for epic operations (singular)
 */
export const epicCommand = new Command('epic')
  .description('Create and manage epics in Kvasar')
  .addCommand(new Command('create')
     .description('Create a new epic\n\nRequires a JSON file with epic data. The epic must include all required fields:\n- name (set to "epic")\n- code\n- columnId\n- description\n- epicOwnerId\n- epicType (solutionEpic, portfolioEpic, or programEpic)\n- kanbanId\n- ownerId\n- parentId\n- portfolioId\n\nSee the Kvasar API documentation for full schema and examples.')
    .option('--file <path>', 'Path to JSON file containing epic data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeEpicCreate(options);
      if (!options.quiet) {
        console.log(formatOutput(result.data, options));
      }
    }));
