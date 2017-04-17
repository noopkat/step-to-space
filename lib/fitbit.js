const FitbitApiClient = require('fitbit-node');
const levelup = require('levelup');
const db = levelup('./fitbitdb');

const client = new FitbitApiClient(process.env.CLIENT_ID, process.env.SECRET);
const activitiesPath = `/activities/date/today.json`;
const lifetimePath = `/activities.json`;
const heartPath = `/activities/heart/date/today/1d/1min.json`;


module.exports.refreshTokens = () => {
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

module.exports.getTodaysDistance = (results) => {
  return new Promise((resolve, reject) => {
    client.get(activitiesPath, results.access_token, process.env.USER_ID)
      .then(results => resolve(results[0].summary.distances.filter((d) => d.activity === 'total')[0].distance))
      .catch(function(error) {
        reject(error.context.errors[0]);
      });
  });
};

module.exports.getLifetimeDistance = (results) => {
  return new Promise((resolve, reject) => {
    client.get(lifetimePath, results.access_token, process.env.USER_ID)
      .then(results => resolve(results[0].lifetime.total.distance))
      .catch(function(error) {
        reject(error.context.errors[0]);
      });
  });
};

module.exports.getStoredLifetimeDistance = () => {
 return new Promise((resolve, reject) => {
    db.get('lifetime', function (error, value) {
      if (error) reject(error);
      resolve(value);
    });
  });
};

module.exports.storeLifetimeDistance = (distance) => {
  return new Promise((resolve, reject) => {
    db.put('lifetime', distance, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

module.exports.storeTotalDistance = (distance) => {
  return new Promise((resolve, reject) => {
    db.get('distance', function (error, value) {
      if (error) reject(error);
      console.log('today\'s distance:', distance);
      const newTotal = parseInt(value) + distance;
      db.put('distance', newTotal, (error) => {
        if (error) reject(error);
        console.log('put new distance in:', newTotal);
        resolve();
      });
    });
  });
};

module.exports.getTotalDistance = () => {
  return new Promise((resolve, reject) => {
    db.get('distance', function (error, value) {
      if (error) reject(error);
      const distance = parseFloat(value);
      resolve(distance);
    });
  });
};

module.exports.getCurrentHeartRate = (results) => {
  return new Promise((resolve, reject) => {
    client.get(heartPath, results.access_token, process.env.USER_ID)
      .then(results => resolve(results[0]['activities-heart-intraday']['dataset'].pop().value))
      .catch(function(error) {
        reject(error);
      });
  });
};

module.exports.getStoredHeartRate = () => {
 return new Promise((resolve, reject) => {
    db.get('heartrate', function (error, value) {
      if (error) reject(error);
      //onst distance = parseFloat(value);
      resolve(value);
    });
  });
};

module.exports.storeHeartRate = (rate) => {
  return new Promise((resolve, reject) => {
    db.put('heartrate', rate, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

