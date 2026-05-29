import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

/**
 * Execute create user story
 */
export async function executeUserStoryCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createUserStory(body);
  return { data };
}

/**
 * Command group for userstory operations (singular)
 */
export const userstoryCommand = new Command('userstory')
  .description('Create and manage user stories in Kvasar')
  .addCommand(new Command('create')
    .description('Create a new user story\n\nRequires a JSON file with user story data. The user story must include all required fields:\n- description\n- kanbanId\n- columnId\n- ownerId\n- portfolioId\n- parentId\n\nOptional fields: acceptanceCriteria, storyPoints, priorityId, task list, activity, businessValue, notes, teamId.\n\nSee the Kvasar API documentation for full schema and examples.')
    .option('--file <path>', 'Path to JSON file containing user story data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeUserStoryCreate(options);
      if (!options.quiet) {
        console.log(formatOutput(result.data, options));
      }
    }));
