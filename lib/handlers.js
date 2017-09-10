const storage = require('./storage');
const tle = require('./ISSTrajectoryData');
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
    storage.getStoredLifetimeDistance()
      .then(distance => reply({distance}))
      .catch(error => reply({error}))
  },

  apiHeartrateHandler: function (request, reply) {
    storage.getStoredHeartRate()
      .then(heartrate => reply({heartrate}))
      .catch(error => reply({error}))
  },
  
  tleHandler: function (request, reply) {
    tle.getTLEData()
      .then(position => reply({position}))
      .catch(error => reply({error}))
  },
  dataHandler: function (request, reply) {
    return reply.file(`./public/data/${request.params.file}`);
  }
};
