
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

This project includes an **MCP-compatible server** so AI agents can discover and invoke the transformation tool automatically.

### Running the MCP Server

```sh
npm run mcp
```

This starts an MCP server on stdio that:
- Exposes a single tool: `api_transform`
- Accepts rawApiResponse, mappingConfig, targetSchema
- Returns transformed JSON + validation results
- Uses the **exact same logic** as the REST API (no duplication)

### Integration with Claude / OpenAI Agents

The MCP server runs on stdio, making it compatible with:
- Claude Desktop (via claude_desktop_config.json)
- OpenAI APIs with tool use
- Any agent framework supporting MCP

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
