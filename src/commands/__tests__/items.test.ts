import { Command } from 'commander';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { itemsCommand, executeItemsGet, executeItemsGetByKey } from '../items.js';
import * as clientModule from '../../utils/client.js';
import * as outputModule from '../../utils/output.js';

describe('items command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('command structure', () => {
    it('should have required subcommands', () => {
      const subcommands = itemsCommand.commands?.map(c => c.name());
      expect(subcommands).toContain('get');
      expect(subcommands).toContain('get-by-key');
      expect(subcommands).toContain('update');
      expect(subcommands).toContain('delete');
      expect(subcommands).toContain('patch');
      expect(subcommands).toContain('add-relation');
    });

    it('should display help for get-by-key subcommand', () => {
      let captured = '';
      itemsCommand.configureOutput({
        writeOut: (str) => { captured += str; },
        writeErr: (str) => { captured += str; }
      });
      itemsCommand.outputHelp();
      expect(captured).toContain('get-by-key');
      expect(captured).toContain('Get an item by key');
      expect(captured).toMatch(/get-by-key.*\[options\]\s*<key>/s);
    });
  });

  describe('executeItemsGet', () => {
    it('should call client.getItem with provided id and return data', async () => {
      const mockClient = {
        getItem: vi.fn().mockResolvedValue({ id: 'TEST-123', name: 'Test Item' }),
      } as any;
      vi.spyOn(clientModule, 'getClient').mockResolvedValue(mockClient);
      vi.spyOn(outputModule, 'formatOutput').mockReturnValue('mocked');

      const result = await executeItemsGet({ id: 'TEST-123', output: 'json', quiet: false });

      expect(clientModule.getClient).toHaveBeenCalledTimes(1);
      expect(mockClient.getItem).toHaveBeenCalledWith('TEST-123');
      expect(result).toEqual({ data: { id: 'TEST-123', name: 'Test Item' } });
    });

    it('should propagate errors from client.getItem', async () => {
      const mockClient = {
        getItem: vi.fn().mockRejectedValue(new Error('Item not found')),
      } as any;
      vi.spyOn(clientModule, 'getClient').mockResolvedValue(mockClient);
      vi.spyOn(outputModule, 'formatOutput').mockReturnValue('mocked');

      await expect(executeItemsGet({ id: 'INVALID', output: 'json', quiet: false }))
        .rejects.toThrow('Item not found');
    });
  });

  describe('executeItemsGetByKey', () => {
    it('should call client.getItemByKey with provided key and return data', async () => {
      const mockClient = {
        getItemByKey: vi.fn().mockResolvedValue({ key: 'ABC-123', name: 'Item by Key' }),
      } as any;
      vi.spyOn(clientModule, 'getClient').mockResolvedValue(mockClient);
      vi.spyOn(outputModule, 'formatOutput').mockReturnValue('mocked');

      const result = await executeItemsGetByKey({ key: 'ABC-123', output: 'json', quiet: false });

      expect(clientModule.getClient).toHaveBeenCalledTimes(1);
      expect(mockClient.getItemByKey).toHaveBeenCalledWith('ABC-123');
      expect(result).toEqual({ data: { key: 'ABC-123', name: 'Item by Key' } });
    });

    it('should propagate errors from client.getItemByKey', async () => {
      const mockClient = {
        getItemByKey: vi.fn().mockRejectedValue(new Error('Key not found')),
      } as any;
      vi.spyOn(clientModule, 'getClient').mockResolvedValue(mockClient);
      vi.spyOn(outputModule, 'formatOutput').mockReturnValue('mocked');

      await expect(executeItemsGetByKey({ key: 'INVALID-KEY', output: 'json', quiet: false }))
        .rejects.toThrow('Key not found');
    });
  });
});
