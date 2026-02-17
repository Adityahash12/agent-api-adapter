
// JSON schema validator using Ajv for adapter outputs

/*
Create a validator that:
- accepts a JSON schema
- validates output data
- returns { valid: boolean, errors: array }
Use Ajv.
*/

const Ajv = require("ajv");
const ajv = new Ajv();

function validate(schema, data) {
	const validateFn = ajv.compile(schema);
	const valid = validateFn(data);
	return {
		valid,
		errors: validateFn.errors || []
	};
}

module.exports = { validate };
