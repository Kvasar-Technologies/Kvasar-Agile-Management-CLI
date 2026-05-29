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
      .description('Create a new epic\n\nIMPORTANT: The JSON must use "name": "epic" as the type discriminator. Your epic\'s actual title goes in the "description" field.\n\nRequired fields:\n- name: "epic" (literal string, not your title)\n- code: short code (e.g., "CLINICAL")\n- columnId: kanban column ID\n- description: your epic\'s title and details\n- epicOwnerId: user ID\n- epicType: "solutionEpic", "portfolioEpic", or "programEpic"\n- kanbanId: kanban board ID\n- ownerId: user ID\n- parentId: parent epic/feature ID (if any)\n- portfolioId: portfolio ID\n\nExample:\n{\n  "name": "epic",\n  "code": "CLINICAL",\n  "description": "Clinical Forecasting Platform with Foresight",\n  "epicType": "portfolioEpic",\n  "portfolioId": "6406330ba1c8c35d1c5edb66",\n  "kanbanId": "6406330ba1c8c35d1c5edb65",\n  "columnId": "477cefb0-00c2-48f8-b653-05942a0335c3",\n  "ownerId": "63f66a33e3a92300120c5ee4",\n  "epicOwnerId": "63f66a33e3a92300120c5ee4"\n}')
     .option('--file <path>', 'Path to JSON file containing epic data')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (options) => {
       const result = await executeEpicCreate(options);
       if (!options.quiet) {
         console.log(formatOutput(result.data, options));
       }
     }));
