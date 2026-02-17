const stringSimilarity = require('string-similarity');

function clean(str) {
  return str
    .toLowerCase()
    .replace(/(_c|_f|_id|_txt)$/, '')
    .replace(/[^a-z0-9]/g, '');
}

function guessMapping(sampleApiResponse, targetSchema) {
  const mapping = {};
  const apiKeys = Object.keys(sampleApiResponse);
  const schemaProps = targetSchema.properties || {};

  for (const outKey in schemaProps) {
    let bestMatch = null;
    let bestScore = 0;

    // Clean target key for comparison
    const cleanOutKey = clean(outKey);

    for (const apiKey of apiKeys) {
      const cleanApiKey = clean(apiKey);

      // 1. Exact match on cleaned keys
      if (cleanOutKey === cleanApiKey) {
        bestMatch = apiKey;
        bestScore = 1;
        break;
      }

      // 2. Fuzzy match on cleaned keys
      const similarity = stringSimilarity.compareTwoStrings(cleanOutKey, cleanApiKey);
      if (similarity > bestScore && similarity > 0.6) {
        bestMatch = apiKey;
        bestScore = similarity;
      }
    }

    mapping[outKey] = bestMatch || null;
  }

  return mapping;
}

module.exports = { guessMapping, clean };
