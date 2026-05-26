import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';

export async function executeEpicsList(args: { 
  organization?: string; 
  portfolio?: string; 
  state?: string; 
  output?: string; 
  quiet?: boolean 
}): Promise<any> {
  const client = await getClient();
  const epics = await client.listEpics();

  // Apply filters
  let filtered = epics;
  if (args.organization) {
    filtered = filtered.filter((epic: any) => 
      epic.valueStreams?.some((vs: any) => vs.organizationId === args.organization)
    );
  }
  if (args.portfolio) {
    filtered = filtered.filter((epic: any) => epic.portfolioId === args.portfolio);
  }
  if (args.state) {
    filtered = filtered.filter((epic: any) => epic.state === args.state);
  }

  return { data: filtered };
}

export const epicsCommand = new Command('epics')
  .description('Manage epics')
  .addCommand(new Command('list')
    .description('List all epics')
    .option('--organization <id>', 'Filter by organization ID')
    .option('--portfolio <id>', 'Filter by portfolio ID')
    .option('--state <state>', 'Filter by state')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeEpicsList(options);
      console.log(formatOutput(result.data, options));
    }));
