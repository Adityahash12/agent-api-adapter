// Core transform logic shared by REST and MCP interfaces
const { adapt } = require('./adapter');
const { validate } = require('./validator');

/**
 * Core transformation function
 * Reused by both REST /transform endpoint and MCP api_transform tool
 * 
 * @param {object} rawApiResponse - The raw API response to transform
 * @param {object} mappingConfig - Field mapping configuration
 * @param {object} targetSchema - JSON schema to validate against
 * @returns {object} { transformed, validation }
 */
function transform(rawApiResponse, mappingConfig, targetSchema) {
  if (!rawApiResponse || !mappingConfig || !targetSchema) {
    throw new Error('rawApiResponse, mappingConfig, and targetSchema are required');
  }
  
  const transformed = adapt(rawApiResponse, mappingConfig);
  const validation = validate(targetSchema, transformed);
  
  return {
    transformed,
    validation
  };
}

module.exports = { transform };
