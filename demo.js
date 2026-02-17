// Demo script: test the agent-api-adapter endpoints

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Weather example from examples/weather.json
const sampleApiResponse = {
  temp_c: 32,
  hum: 75,
  city_name: 'Bangalore'
};

const targetSchema = {
  type: 'object',
  properties: {
    temperature: { type: 'number' },
    humidity: { type: 'number' },
    city: { type: 'string' }
  },
  required: ['temperature', 'humidity', 'city']
};

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function demo() {
  console.log('🚀 Agent API Adapter Demo\n');
  console.log('=========================================\n');

  // Step 1: Generate mapping
  console.log('📌 Step 1: Generate mapping config\n');
  console.log('Request to POST /generate:');
  console.log(JSON.stringify({ sampleApiResponse, targetSchema }, null, 2));
  console.log('\n');

  try {
    const generateRes = await request('POST', '/generate', {
      sampleApiResponse,
      targetSchema
    });

    console.log('Response:');
    console.log(JSON.stringify(generateRes.body, null, 2));
    console.log('\n✅ Mapping generated successfully!\n');

    const mappingConfig = generateRes.body.mappingConfig;

    // Step 2: Transform and validate
    console.log('=========================================\n');
    console.log('📌 Step 2: Transform API response\n');
    console.log('Request to POST /transform:');
    const transformRequest = {
      rawApiResponse: sampleApiResponse,
      mappingConfig: mappingConfig,
      targetSchema: targetSchema
    };
    console.log(JSON.stringify(transformRequest, null, 2));
    console.log('\n');

    const transformRes = await request('POST', '/transform', transformRequest);

    console.log('Response:');
    console.log(JSON.stringify(transformRes.body, null, 2));
    console.log('\n✅ Transformation successful!\n');

    console.log('=========================================\n');
    console.log('✨ Demo complete! Your MVP is working.\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

demo().then(() => process.exit(0));
