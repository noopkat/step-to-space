const fitbit = require('./fitbit');

module.exports = {
  rootHandler: function(request, reply) {
    return reply.file('./public/index.html');
  },

  cssHandler: function (request, reply) {
    return reply.file(`./public/css/${request.params.file}`);
  },

  jsHandler: function (request, reply) {
    return reply.file(`./public/js/${request.params.file}`);
  },

  imageHandler: function (request, reply) {
    return reply.file(`./public/images/${request.params.file}`);
  },

  apiDistanceHandler: function (request, reply) {
    fitbit.getStoredLifetimeDistance()
      .then(distance => reply({distance}))
      .catch(error => reply({error}))
  },

  apiHeartrateHandler: function (request, reply) {
    fitbit.getStoredHeartRate()
      .then(heartrate => reply({heartrate}))
      .catch(error => reply({error}))
  }
};
