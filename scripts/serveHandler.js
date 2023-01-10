const handler = require('serve-handler');
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  return handler(req, res);
});

server.listen(port, () => {
  console.log('running on port ', port);
});