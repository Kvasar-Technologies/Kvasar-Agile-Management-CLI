import fs from 'fs';
import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';

export async function executeTeamsList(args: { output?: string; fields?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const data = await client.listTeams();
  return { data };
}

export async function executeTeamsCreate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.createTeam(body);
  return { data };
}

export async function executeTeamsUpdate(args: { file?: string; output?: string; quiet?: boolean }): Promise<any> {
  const client = await getClient();
  const body = args.file ? JSON.parse(fs.readFileSync(args.file, 'utf-8')) : {};
  const data = await client.updateTeam(body);
  return { data };
}

export const teamsCommand = new Command('teams')
  .description('Manage teams')
  .addCommand(new Command('list')
    .description('List all teams')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeTeamsList(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('create')
    .description('Create a new team')
    .option('--file <path>', 'JSON file with team data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeTeamsCreate(options);
      console.log(formatOutput(result.data, options));
    }))
  .addCommand(new Command('update')
    .description('Update a team (PUT)')
    .option('--file <path>', 'JSON file with updated data')
    .option('--output <format>', 'Output format: json or pretty', 'json')
    .option('--quiet', 'Suppress output')
    .action(async (options) => {
      const result = await executeTeamsUpdate(options);
      console.log(formatOutput(result.data, options));
    }));
