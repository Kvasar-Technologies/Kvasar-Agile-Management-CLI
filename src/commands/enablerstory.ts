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
      .description('Create a new enabler story\n\nIMPORTANT: The JSON must use "name": "enablerstory" as the type discriminator. Your story\'s actual title goes in the "description" field.\n\nRequired fields:\n- name: "enablerstory" (literal string)\n- kanbanId: kanban board ID\n- columnId: kanban column ID\n- ownerId: user ID\n- parentId: parent feature/epic ID\n- portfolioId: portfolio ID\n\nOptional fields: description, acceptanceCriteria, priorityId, storyPoints, notes, teamId, enablerType (defect, devOps, refactoring, spike, execution, configuration, performance).\n\nExample:\n{\n  "name": "enablerstory",\n  "description": "Set up CI/CD pipeline for the project",\n  "portfolioId": "6406330ba1c8c35d1c5edb66",\n  "kanbanId": "6406330ba1c8c35d1c5edb65",\n  "columnId": "477cefb0-00c2-48f8-b653-05942a0335c3",\n  "ownerId": "63f66a33e3a92300120c5ee4",\n  "parentId": "69447ddae31fcc4aa35a873f",\n  "enablerType": "devOps"\n}')
     .option('--file <path>', 'Path to JSON file containing enabler story data')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (options) => {
       const result = await executeEnablerStoryCreate(options);
       if (!options.quiet) {
         console.log(formatOutput(result.data, options));
       }
     }));
