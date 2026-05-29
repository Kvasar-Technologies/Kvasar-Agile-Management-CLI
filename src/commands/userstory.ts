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
      .description('Create a new user story\n\nIMPORTANT: The JSON must use "name": "userstory" as the type discriminator. Your story\'s actual title goes in the "description" field.\n\nRequired fields:\n- name: "userstory" (literal string)\n- description: story title/details\n- kanbanId: kanban board ID\n- columnId: kanban column ID\n- ownerId: user ID\n- portfolioId: portfolio ID\n- parentId: parent feature ID\n\nOptional fields: acceptanceCriteria, storyPoints, priorityId, task list, activity, businessValue, notes, teamId.\n\nExample:\n{\n  "name": "userstory",\n  "description": "As a user, I want to upload a dataset for anonymization",\n  "portfolioId": "6406330ba1c8c35d1c5edb66",\n  "kanbanId": "6406330ba1c8c35d1c5edb65",\n  "columnId": "477cefb0-00c2-48f8-b653-05942a0335c3",\n  "ownerId": "63f66a33e3a92300120c5ee4",\n  "parentId": "69447ddae31fcc4aa35a873f"\n}')
     .option('--file <path>', 'Path to JSON file containing user story data')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (options) => {
       const result = await executeUserStoryCreate(options);
       if (!options.quiet) {
         console.log(formatOutput(result.data, options));
       }
     }));
