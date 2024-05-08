const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const requestHandler = (clientReq, clientRes) => {
  const requestOptions = {
    hostname: 'inv.nadeko.net',
    port: 443,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers
  };

  const proxyReq = https.request(requestOptions, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });

  clientReq.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    clientRes.statusCode = 500;
    clientRes.end('Proxy error');
  });
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Proxy server is listening on port ${PORT}`);
});
