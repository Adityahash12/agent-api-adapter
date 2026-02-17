// Adapter engine that transforms input JSON into a target schema
// based on a generated mapping configuration

/*
Write a function that:
- accepts (inputJson, mappingConfig)
- mappingConfig maps outputField -> inputField
- returns a new object following the target schema
- safely handles missing fields
*/

function adapt(input, mapping) {
	const output = {};
	for (const key in mapping) {
		const source = mapping[key];
		output[key] = input[source] ?? null;
	}
	return output;
}

module.exports = { adapt };
