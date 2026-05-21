import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { allCommands } from '../commands/index.js';
import { resolveAccessToken } from '../core/auth.js';
import { KvasarClient } from '../core/client.js';

export async function startMcpServer(): Promise<void> {
  const accessToken = await resolveAccessToken();

  const client = new KvasarClient({
    accessToken,
  });

  const server = new McpServer({
    name: 'kvasar',
    version: '0.1.0',
  });

  // Register all CLI commands as MCP tools
  for (const cmdDef of allCommands) {
    const shape = cmdDef.inputSchema.shape;

    server.registerTool(
      cmdDef.name,
      {
        description: cmdDef.description,
        inputSchema: shape,
      },
      async (args: Record<string, unknown>) => {
        try {
          const result = await cmdDef.handler(args, client);

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    error: error.message ?? String(error),
                    code: error.code ?? 'UNKNOWN_ERROR',
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error(
    `Kvasar MCP server started. Tools registered: ${allCommands.length}`
  );
}