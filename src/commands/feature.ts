import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';
import * as fs from 'fs';

/**
 * Execute create feature
 */
export async function executeFeatureCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createFeature(body);
  return { data };
}

/**
 * Command group for feature operations (singular)
 */
export const featureCommand = new Command('feature')
  .description('Create and manage features in Kvasar')
  .addCommand(new Command('create')
      .description('Create a new feature\n\nIMPORTANT: The JSON must use "name": "feature" as the type discriminator. Your feature\'s actual title goes in the "description" field.\n\nSAFe Hierarchy Note:\n- Epics live in a Portfolio Kanban\n- Features live in a Program/Solution Kanban (linked to an ART or Solution)\n- Create features under a portfolio by using the Program Kanban ID, not the Portfolio Kanban ID\n\nRequired fields:\n- name: "feature" (literal string, not your title)\n- description: your feature\'s title and details\n- kanbanId: Program kanban board ID (not Portfolio)\n- columnId: kanban column ID\n- ownerId: user ID\n- portfolioId: portfolio ID\n- parentId: parent epic ID\n\nOptional fields: acceptanceCriteria, benefitHypothesis, dor, featureOwnerId, normalizedStoryPoints, priorizationId, isMvp, teams, programIncrementId, solutionId, artId.\n\nExample (KVASAR SAAS portfolio):\n{\n  "name": "feature",\n  "description": "Data Anonymization Service",\n  "portfolioId": "6406330ba1c8c35d1c5edb66",\n  "kanbanId": "63fb12339001225a2af32ce5",\n  "columnId": "91dafed8-d4c4-48b6-b788-8f12cfd6bda6",\n  "ownerId": "63f66a33e3a92300120c5ee4",\n  "parentId": "6a19ce037c6bb2446519df03"\n}')
     .option('--file <path>', 'Path to JSON file containing feature data')
     .option('--output <format>', 'Output format: json or pretty', 'json')
     .option('--quiet', 'Suppress output')
     .action(async (options) => {
       const result = await executeFeatureCreate(options);
       if (!options.quiet) {
         console.log(formatOutput(result.data, options));
       }
     }));
