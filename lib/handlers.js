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
      .then((distance) => reply({distance: distance}))
      .catch((error) => reply({error: error}))
  },

  apiHeartrateHandler: function (request, reply) {
    fitbit.getStoredHeartRate()
      .then((rate) => reply({heartrate: rate}))
      .catch((error) => reply({error: error.message}))
  }
};
