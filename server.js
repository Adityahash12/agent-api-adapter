
// Express server that generates adapters and applies transformations

/*
Build an Express server with:
POST /generate
- input: sampleApiResponse, targetSchema
- output: mappingConfig

POST /transform
- input: rawApiResponse, mappingConfig, targetSchema
- output: transformed JSON + validation result
*/

const express = require('express');
const bodyParser = require('body-parser');
const { adapt } = require('./adapter');
const { validate } = require('./validator');
const { guessMapping } = require('./mapping');

const app = express();
app.use(bodyParser.json());

app.post('/generate', (req, res) => {
	const { sampleApiResponse, targetSchema } = req.body;
	if (!sampleApiResponse || !targetSchema) {
		return res.status(400).json({ error: 'sampleApiResponse and targetSchema are required' });
	}
	const mappingConfig = guessMapping(sampleApiResponse, targetSchema);
	res.json({ mappingConfig });
});

app.post('/transform', (req, res) => {
	const { rawApiResponse, mappingConfig, targetSchema } = req.body;
	if (!rawApiResponse || !mappingConfig || !targetSchema) {
		return res.status(400).json({ error: 'rawApiResponse, mappingConfig, and targetSchema are required' });
	}
	const transformed = adapt(rawApiResponse, mappingConfig);
	const validation = validate(targetSchema, transformed);
	res.json({ transformed, validation });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Agent API Adapter server running on port ${PORT}`);
});

