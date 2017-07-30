require('dotenv').config();

const Hapi = require('hapi');
const routes = require('./lib/routes');

const server = new Hapi.Server();
server.connection({ 
  host: 'localhost', 
  port: process.env.PORT || 3000 
});

server.register(require('inert'), (err) => {
  if (err) throw err;
  server.route(routes);
});

server.start((err) => {
  if (err) throw err;
  console.log('Server running at:', server.info.uri);
});
