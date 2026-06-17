import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

/**
 * Execute create issue
 */
export async function executeIssueCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createIssue(body);
  return { data };
}

/**
 * Command group for issue operations (singular)
 */
export const issueCommand = new Command('issue')
  .description('Create and manage issues in Kvasar')
  .addCommand(new Command('create')
      .description('Create a new issue\n\nIMPORTANT: The JSON must use "name": "issue" as the type discriminator. Your issue\'s actual title goes in the "description" field.\n\nRequired fields:\n- name: "issue" (literal string)\n- kanbanId: kanban board ID\n- columnId: kanban column ID\n- ownerId: user ID\n- parentId: parent feature/epic ID\n- portfolioId: portfolio ID\n\nOptional fields: description, summary.\n\nExample:\n{\n  "name": "issue",\n  "description": "Fix memory leak in data processing module",\n  "portfolioId": "6406330ba1c8c35d1c5edb66",\n  "kanbanId": "6406330ba1c8c35d1c5edb65",\n  "columnId": "477cefb0-00c2-48f8-b653-05942a0335c3",\n  "ownerId": "63f66a33e3a92300120c5ee4",\n  "parentId": "69447ddae31fcc4aa35a873f"\n}')
     .option('--file <path>', 'Path to JSON file containing issue data')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (options) => {
       const result = await executeIssueCreate(options);
       if (!options.quiet) {
         console.log(formatOutput(result.data, options));
       }
     }));
