require('dotenv').config();

const schedule = require('node-schedule');
const fitbit = require('./lib/fitbit');
const Hapi = require('hapi');
const routes = require('./lib/routes');

const checkHeart = setInterval(fitbit.updateHeartrate, 5 * 60 * 1000);
const sched = schedule.scheduleJob('50 4 * *', fitbit.updateLifetimeDistance);

fitbit.updateLifetimeDistance();

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