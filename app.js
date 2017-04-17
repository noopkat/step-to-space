require('dotenv').config();

const schedule = require('node-schedule');
const fitbit = require('./lib/fitbit');
const Hapi = require('hapi');

const sched = schedule.scheduleJob('50 4 * *', () => {
  fitbit.refreshTokens()
    .then((results) => fitbit.getLifetimeDistance(results))
    .then((distance) => fitbit.storeLifetimeDistance(distance))
    .catch(function(error) {
      console.log('error:', error);
    });
});

fitbit.refreshTokens()
    .then((results) => fitbit.getLifetimeDistance(results))
    .then((distance) => fitbit.storeLifetimeDistance(distance))
    .catch(function(error) {
      console.log('error:', error);
    });

const checkHeart = setInterval(() => {
  fitbit.refreshTokens()
   .then((results) => fitbit.getCurrentHeartRate(results))
   .then((rate) => fitbit.storeHeartRate(rate))
    .catch(function(error) {
      console.log('error:', error);
    });
}, 5 * 60 * 1000);

const server = new Hapi.Server();
server.connection({ 
  host: 'localhost', 
  port: process.env.PORT || 3000 
});

server.register(require('inert'), (err) => {
  if (err) throw err;
  server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
      return reply.file('./public/index.html');
    }
  });

  server.route({
    method: 'GET',
    path:'/css/{file}', 
    handler: function (request, reply) {
      return reply.file(`./public/css/${request.params.file}`);
    }
  });

  server.route({
    method: 'GET',
    path:'/images/{file}', 
    handler: function (request, reply) {
      return reply.file(`./public/images/${request.params.file}`);
    }
  });

  server.route({
    method: 'GET',
    path:'/api/distance', 
    handler: function (request, reply) {
      fitbit.getStoredLifetimeDistance()
        .then((distance) => reply({distance: distance}))
        .catch((error) => reply({error: error}))
    }
  });

  server.route({
    method: 'GET',
    path:'/api/heart', 
    handler: function (request, reply) {
      fitbit.getStoredHeartRate()
        .then((rate) => reply({heartrate: rate}))
        .catch((error) => reply({error: error.message}))
    }
  });

});

server.start((err) => {
  if (err) throw err;
  console.log('Server running at:', server.info.uri);
});