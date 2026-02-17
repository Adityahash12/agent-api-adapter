/**
 * MCP Tool Definition for Agent API Adapter
 * This file defines the MCP-compatible tool schema.
 * Execution is delegated to the REST API for now.
 */

module.exports = {
  name: 'api_transform',
  description: 'Transform raw API responses into a validated agent-friendly schema',
  inputSchema: {
    type: 'object',
    properties: {
      rawApiResponse: { type: 'object' },
      mappingConfig: { type: 'object' },
      targetSchema: { type: 'object' },
    },
    required: ['rawApiResponse', 'mappingConfig', 'targetSchema'],
  },
};
