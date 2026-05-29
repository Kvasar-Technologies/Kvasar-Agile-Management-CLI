import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

/**
 * Execute create enabler story
 */
export async function executeEnablerStoryCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createEnablerStory(body);
  return { data };
}

/**
 * Command group for enablerstory operations (singular)
 */
export const enablerstoryCommand = new Command('enablerstory')
  .description('Create and manage enabler stories in Kvasar')
  .addCommand(new Command('create')
    .description('Create a new enabler story\n\nRequires a JSON file with enabler story data. The enabler story must include all required fields:\n- kanbanId\n- columnId\n- ownerId\n- parentId\n- portfolioId\n\nOptional fields: description, acceptanceCriteria, priorityId, storyPoints, notes, teamId, enablerType (defect, devOps, refactoring, spike, execution, configuration, performance).\n\nSee the Kvasar API documentation for full schema and examples.')
    .option('--file <path>', 'Path to JSON file containing enabler story data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeEnablerStoryCreate(options);
      if (!options.quiet) {
        console.log(formatOutput(result.data, options));
      }
    }));
