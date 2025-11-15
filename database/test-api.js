const http = require('http');

// Test API endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/bets',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing API endpoint: http://localhost:5000/api/bets');

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Not valid JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.setTimeout(5000, () => {
  console.log('Request timeout');
  req.destroy();
});

req.end();