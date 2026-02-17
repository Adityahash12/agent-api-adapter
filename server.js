
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
const { guessMapping } = require('./mapping');
const { transform } = require('./transform');

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
	try {
		const result = transform(rawApiResponse, mappingConfig, targetSchema);
		res.json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Agent API Adapter server running on port ${PORT}`);
});

