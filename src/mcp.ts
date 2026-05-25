import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

/**
 * MCP server is currently disabled.
 * To enable, implement command registration using the CLI command functions.
 */
export async function startMcpServer(): Promise<void> {
  console.error('MCP server is disabled in this build.');
  // Future: register tools from all commands
}
