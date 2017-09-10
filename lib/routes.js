const handlers = require('./handlers');

module.exports = [
  { method: 'GET', path:'/', handler: handlers.rootHandler },
  { method: 'GET', path:'/css/{file}', handler: handlers.cssHandler },
  { method: 'GET', path:'/js/{file}', handler: handlers.jsHandler },
  { method: 'GET', path:'/images/{file}', handler: handlers.imageHandler },
  { method: 'GET', path:'/api/distance', handler: handlers.apiDistanceHandler},
  { method: 'GET', path:'/api/heart', handler: handlers.apiHeartrateHandler },
  { method: 'GET', path:'/data/{file}', handler: handlers.dataHandler },
  { method: 'GET', path:'/api/tle', handler: handlers.tleHandler }
];