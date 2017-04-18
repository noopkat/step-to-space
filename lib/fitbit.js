const FitbitApiClient = require('fitbit-node');
const levelup = require('levelup');
const db = levelup('./fitbitdb');

const client = new FitbitApiClient(process.env.CLIENT_ID, process.env.SECRET);
const activitiesPath = `/activities/date/today.json`;
const lifetimePath = `/activities.json`;
const heartPath = `/activities/heart/date/today/1d/1min.json`;


const refreshTokens = () => {
  return new Promise((resolve, reject) => {
    db.get('tokens', function (err, value) {
      if (err) reject(err);

      const rJson = JSON.parse(value);

      client.refreshAccessToken(rJson.access_token, rJson.refresh_token)
        .then(function(results) {
          const newTokens = {
            access_token: results.access_token,
            refresh_token: results.refresh_token
          };

          db.put('tokens', JSON.stringify(newTokens), (error) => {
            if (error) reject(error);
            resolve(results);
            console.log('put new tokens in.');
          });
        }).catch((error) => {
          reject(error);
        });
    });
  });
};


const getLifetimeDistance = (results) => {
  return new Promise((resolve, reject) => {
    client.get(lifetimePath, results.access_token, process.env.USER_ID)
      .then(results => resolve(parseInt(results.shift().lifetime.total.distance)))
      .catch(function(error) {
        reject(error.context.errors[0]);
      });
  });
};

const getStoredLifetimeDistance = () => {
 return new Promise((resolve, reject) => {
    db.get('lifetime', function (error, value) {
      if (error) reject(error);
      resolve(value);
    });
  });
};

const storeLifetimeDistance = (distance) => {
  return new Promise((resolve, reject) => {
    db.put('lifetime', distance, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

const getCurrentHeartRate = (results) => {
  return new Promise((resolve, reject) => {
    client.get(heartPath, results.access_token, process.env.USER_ID)
      .then(results => resolve(parseInt(results.shift()['activities-heart-intraday']['dataset'].pop().value)))
      .catch(function(error) {
        reject(error);
      });
  });
};

const getStoredHeartRate = () => {
 return new Promise((resolve, reject) => {
    db.get('heartrate', function (error, value) {
      if (error) reject(error);
      resolve(value);
    });
  });
};

const storeHeartRate = (rate) => {
  return new Promise((resolve, reject) => {
    db.put('heartrate', rate, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

const updateLifetimeDistance = () => {
  refreshTokens()
    .then((results) => getLifetimeDistance(results))
    .then((distance) => storeLifetimeDistance(distance))
    .catch(function(error) {
      console.log('error:', error);
    });
};

const updateHeartrate = () => {
  refreshTokens()
   .then((results) => getCurrentHeartRate(results))
   .then((rate) => storeHeartRate(rate))
    .catch(function(error) {
      console.log('error:', error);
    });
}

module.exports = { updateLifetimeDistance, updateHeartrate, getStoredHeartRate, getStoredLifetimeDistance };