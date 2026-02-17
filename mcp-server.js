// MCP Server for Agent API Adapter
// Exposes the transformation logic as an MCP tool
// Run: node mcp-server.js

const { Server } = require('@modelcontextprotocol/sdk/server/stdio');
const {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  TextContent,
  ErrorResponse
} = require('@modelcontextprotocol/sdk/types');
const { transform } = require('./transform');

// Initialize MCP Server
const server = new Server(
  {
    name: 'agent-api-adapter',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * MCP Tool Handler: List available tools
 * Registers the api_transform tool with the MCP protocol
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'api_transform',
        description: 'Transform any JSON API response into an agent-friendly schema. Accepts raw API response, mapping configuration, and target schema. Returns transformed JSON and validation results.',
        inputSchema: {
          type: 'object',
          properties: {
            rawApiResponse: {
              type: 'object',
              description: 'The raw API response to transform',
            },
            mappingConfig: {
              type: 'object',
              description: 'Field mapping config: { targetField: sourceField, ... }',
            },
            targetSchema: {
              type: 'object',
              description: 'JSON Schema defining the target structure',
            },
          },
          required: ['rawApiResponse', 'mappingConfig', 'targetSchema'],
        },
      },
    ],
  };
});

/**
 * MCP Tool Handler: Execute tool
 * Routes tool calls to the appropriate function
 * Currently only api_transform is supported
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;

  if (name !== 'api_transform') {
    return new ErrorResponse({
      code: -32601,
      message: `Unknown tool: ${name}`,
    });
  }

  // Extract input arguments
  const { rawApiResponse, mappingConfig, targetSchema } = args;

  try {
    // Call the core transform function (shared with REST API)
    // This ensures both MCP and REST endpoints use identical business logic
    const result = transform(rawApiResponse, mappingConfig, targetSchema);

    return {
      content: [
        new TextContent({
          type: 'text',
          text: JSON.stringify(result, null, 2),
        }),
      ],
    };
  } catch (error) {
    return new ErrorResponse({
      code: -32603,
      message: `Transformation failed: ${error.message}`,
    });
  }
});

// Start the MCP server
// Runs on stdio transport (standard input/output)
// This allows Claude, OpenAI, or other agents to communicate via stdin/stdout
async function main() {
  const transport = new (require('@modelcontextprotocol/sdk/server/stdio').StdioServerTransport)();
  await server.connect(transport);
  console.error('Agent API Adapter MCP server running on stdio');
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
