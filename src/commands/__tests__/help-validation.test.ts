import { Command } from 'commander';
import { describe, it, expect, beforeAll } from 'vitest';
import { registerAllCommands } from '../index.js';

describe('Help Documentation Validation', () => {
  let program: Command;

  beforeAll(() => {
    program = new Command();
    // Replicate root program setup from src/index.ts
    program
      .name('kvasar')
      .description('AI-native CLI and MCP server for Kvasar Agile Management')
      .version('0.1.0')
      .option('--access-token <token>', 'Access token (overrides KVASAR_API_TOKEN env var and stored config)')
      .option('--output <format>', 'Output format: json (default) or pretty', 'json')
      .option('--pretty', 'Shorthand for --output pretty')
      .option('--quiet', 'Suppress output, exit codes only')
      .option('--fields <fields>', 'Comma-separated list of fields to include in output');
    registerAllCommands(program);
  });

  describe('Root Help', () => {
    it('should list all expected top-level commands', () => {
      const help = program.helpInformation();
      const expected = [
        'login', 'logout', 'whoami', 'value-streams', 'users', 'teams',
        'strategic-themes', 'solutions', 'portfolios', 'pis', 'organizations',
        'items', 'epics', 'epic', 'feature', 'userstory', 'enablerstory',
        'issue', 'kpis', 'kanbans', 'objectives', 'arts', 'auth-change',
        'products', 'services', 'systems',
      ];
      for (const cmd of expected) {
        expect(help).toContain(cmd);
      }
    });

    it('should include standard global options', () => {
      const help = program.helpInformation();
      expect(help).toContain('--access-token');
      expect(help).toContain('--output');
      expect(help).toContain('--quiet');
      expect(help).toContain('--fields');
    });

    it('should not include non-existent commands in command names', () => {
      const commandNames = program.commands.map(c => c.name());
      const nonExistent = ['roadmaps', 'groups', 'leaders', 'templates'];
      for (const name of nonExistent) {
        expect(commandNames).not.toContain(name);
      }
    });
  });

  describe('Items Command', () => {
    it('should list all subcommands', () => {
      const itemsCmd = program.commands.find(c => c.name() === 'items');
      expect(itemsCmd).toBeDefined();
      const help = itemsCmd!.helpInformation();
      const expectedSub = ['get', 'get-by-key', 'update', 'delete', 'patch', 'add-relation'];
      for (const sub of expectedSub) {
        expect(help).toContain(sub);
      }
    });

    it('get command should show <id> argument', () => {
      const itemsCmd = program.commands.find(c => c.name() === 'items');
      const help = itemsCmd!.helpInformation();
      expect(help).toMatch(/get\s+\[options\]\s*<id>/);
    });

    it('get-by-key command should show <key> argument', () => {
      const itemsCmd = program.commands.find(c => c.name() === 'items');
      const help = itemsCmd!.helpInformation();
      expect(help).toMatch(/get-by-key\s+\[options\]\s*<key>/);
    });
  });

  describe('All Commands Have Unique Names', () => {
    it('should have no duplicate command names at root level', () => {
      const names = program.commands.map(c => c.name());
      const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
      expect(duplicates).toEqual([]);
    });
  });

  describe('Command Descriptions', () => {
    it('all top-level commands should have non-empty descriptions', () => {
      for (const cmd of program.commands) {
        const desc = cmd.description();
        expect(desc).toBeDefined();
        expect(desc.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Argument Syntax for ID-Based Commands', () => {
    const checks: Array<{ parent: string; name: string; pattern: RegExp }> = [
      { parent: 'items', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'items', name: 'update', pattern: /update\s+\[options\]\s*<id>/ },
      { parent: 'items', name: 'delete', pattern: /delete\s+\[options\]\s*<id>/ },
      { parent: 'items', name: 'patch', pattern: /patch\s+\[options\]\s*<id>/ },
      { parent: 'items', name: 'add-relation', pattern: /add-relation\s+\[options\]\s*<id>/ },
      { parent: 'items', name: 'get-by-key', pattern: /get-by-key\s+\[options\]\s*<key>/ },
      { parent: 'organizations', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'value-streams', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'strategic-themes', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'solutions', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'pis', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'products', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'services', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
      { parent: 'systems', name: 'get', pattern: /get\s+\[options\]\s*<id>/ },
    ];

    it('should have correct argument syntax in help for each command', () => {
      for (const { parent, name, pattern } of checks) {
        const parentCmd = program.commands.find(c => c.name() === parent);
        expect(parentCmd).toBeDefined();
        const help = parentCmd!.helpInformation();
        expect(help).toMatch(pattern);
      }
    });
  });
});
