
# Agent API Adapter

Translate any API response into an agent-friendly JSON schema automatically.

**Status:** MVP complete. Works end-to-end. Actively looking for early users and feedback.

📖 **[Read the Skill Documentation](SKILL.md)** — Detailed guide on using this as an agent skill.

## What problem does this solve?

APIs are inconsistent. AI agents need predictable, agent-friendly JSON schemas to reason, plan, and act. This adapter bridges the gap between messy real-world APIs and structured agent workflows.

## Quick Start

1. Install dependencies:
	 ```sh
	 npm install
	 ```
2. Start the server:
	 ```sh
	 npm start
	 ```

## Example Request/Response

### 1. Generate a mapping config

```sh
curl -X POST http://localhost:3000/generate \
	-H "Content-Type: application/json" \
	-d '{
		"sampleApiResponse": {"temp_c":32,"hum":75,"city_name":"Bangalore"},
		"targetSchema": {
			"type": "object",
			"properties": {
				"temperature": { "type": "number" },
				"humidity": { "type": "number" },
				"city": { "type": "string" }
			},
			"required": ["temperature", "humidity", "city"]
		}
	}'
```

**Response:**
```json
{
	"mappingConfig": {
		"temperature": "temp_c",
		"humidity": "hum",
		"city": "city_name"
	}
}
```

### 2. Transform and validate

```sh
curl -X POST http://localhost:3000/transform \
	-H "Content-Type: application/json" \
	-d '{
		"rawApiResponse": {"temp_c":32,"hum":75,"city_name":"Bangalore"},
		"mappingConfig": {"temperature":"temp_c","humidity":"hum","city":"city_name"},
		"targetSchema": {
			"type": "object",
			"properties": {
				"temperature": { "type": "number" },
				"humidity": { "type": "number" },
				"city": { "type": "string" }
			},
			"required": ["temperature", "humidity", "city"]
		}
	}'
```

**Response:**
```json
{
	"transformed": {
		"temperature": 32,
		"humidity": 75,
		"city": "Bangalore"
	},
	"validation": {
		"valid": true,
		"errors": null
	}
}
```

## Why is this useful for autonomous agents?

- Ensures predictable, validated data for downstream reasoning
- Reduces manual integration work
- Enables rapid prototyping and scaling of agent skills

## MCP Interface (Model Context Protocol)

This project provides an **MCP-compatible tool definition** so agent frameworks can discover the `api_transform` tool. Execution is currently delegated to the REST API; native MCP runtime hosting is planned for the future.

For Phase 1 integration, use the included `mcp-tool.js` which defines the `api_transform` tool schema. Agent hosts (Claude Desktop, OpenClaw, etc.) can register this tool and route invocations to the REST `/transform` endpoint.

### 🔰 Current Status

- ❇ REST /generate & /transform – fully working  
- ❇ MCP tool *defined* (tools.json / SKILL.md)  
- ⚠ Not a standalone MCP runtime server yet


### How to use the tool definition

1. Provide `mcp-tool.js` to your agent host or registry.
2. The tool declares inputs: `rawApiResponse`, `mappingConfig`, and `targetSchema`.
3. When invoked, execution should call the REST endpoint `POST /transform` on this service.

This approach keeps a single source of execution (the REST API) while making the tool discoverable to MCP-compatible hosts.
Example configuration for Claude Desktop:

```json
{
  "mcpServers": {
    "agent-api-adapter": {
      "command": "node",
      "args": ["path/to/mcp-server.js"]
    }
  }
}
```

### REST API Still Works

Both interfaces coexist:
- **REST:** `npm start` → Express on port 3000
- **MCP:** `npm run mcp` → Stdio transport

Both call the same core `transform()` function from `transform.js`.

---

## 🛒 Using as a Marketplace Skill

This project is built to be listed as a purchasable/distributable **agent skill**.

- **Skill Manifest:** [skills.json](skills.json) - Use this for skill registries
- **Skill Documentation:** [SKILL.md](SKILL.md) - Detailed skill guide for agents

Compatible with skill marketplaces and agent skill discovery systems.

---

## Roadmap

- [x] Naive mapping (exact, lowercase, partial match)
- [x] MCP (Model Context Protocol) interface
- [ ] Synonym/semantic mapping
- [ ] LLM-assisted mapping
- [ ] Hosted API & dashboard
- [ ] Demo GIF & screenshots

---
MIT License
