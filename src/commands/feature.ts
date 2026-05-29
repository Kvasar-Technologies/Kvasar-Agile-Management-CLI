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
     .description('Create a new feature\n\nRequires a JSON file with feature data. The feature must include all required fields:\n- name (must be "feature")\n- description\n- kanbanId\n- columnId\n- ownerId\n- portfolioId\n- parentId\n\nOptional fields: acceptanceCriteria, benefitHypothesis, dor, featureOwnerId, normalizedStoryPoints, priorizationId, isMvp, teams, programIncrementId, solutionId, artId.\n\nSee the Kvasar API documentation for full schema and examples.')
    .option('--file <path>', 'Path to JSON file containing feature data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeFeatureCreate(options);
      if (!options.quiet) {
        console.log(formatOutput(result.data, options));
      }
    }));
