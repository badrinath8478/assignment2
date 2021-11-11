const http = require('http');
const app = require('./app');

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, function () {
    console.log(`The Server Has Started! at port ${port}`);
  });