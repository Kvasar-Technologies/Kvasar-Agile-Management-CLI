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
    .description('Create a new issue\n\nRequires a JSON file with issue data. The issue must include all required fields:\n- name (set to "issue")\n- kanbanId\n- columnId\n- ownerId\n- parentId\n- portfolioId\n\nOptional fields: description, summary.\n\nSee the Kvasar API documentation for full schema and examples.')
    .option('--file <path>', 'Path to JSON file containing issue data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeIssueCreate(options);
      if (!options.quiet) {
        console.log(formatOutput(result.data, options));
      }
    }));
