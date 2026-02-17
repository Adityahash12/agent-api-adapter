## Agent API Adapter — Make Any API Work With Autonomous AI Agents

This tool automatically generates **adapter code** that converts messy API responses into a clean JSON schema agents can understand.  
It’s perfect for agent builders who don’t want to write custom integration code.
## Why This Matters

AI agents (OpenClaw, LangChain, AutoGPT, etc.) break when APIs have inconsistent responses.  
This project:
- Automatically maps fields
- Suggests intelligent mappings
- Outputs validated JSON
- Saves hours of integration work

# Agent API Adapter

Translate any API response into an agent-friendly JSON schema automatically.

**Status:** MVP complete. Works end-to-end. Actively looking for early users and feedback.

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

## Roadmap

- [x] Naive mapping (exact, lowercase, partial match)
- [ ] Synonym/semantic mapping
- [ ] LLM-assisted mapping
- [ ] Hosted API & dashboard
- [ ] Demo GIF & screenshots

---
MIT License
