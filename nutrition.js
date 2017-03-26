
var search = 'cookie';
var http = require('http');

var options = {
  hostname: 'api.nutritionix.com',
  port: 80,
  path: '/search/' + encodeURI(search) + '?results=0:1&fields=item_name,brand_name,item_id,nf_calories&appId=f0efc5ac&appKey=75f8e573f3d4e21f9b74334e590dc47a',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

var req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

req.end();
