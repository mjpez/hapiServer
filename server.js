'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'Get',
  path: '/hello',
  handler: function (request, h) {
    return 'hello world';
  }
});

async function start() {
  try {
    await server.start();
  } catch (err) {

  }
}
