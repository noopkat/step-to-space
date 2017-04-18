const FitbitApiClient = require('fitbit-node');
const levelup = require('levelup');
const db = levelup('./fitbitdb');

const client = new FitbitApiClient(process.env.CLIENT_ID, process.env.SECRET);
const lifetimePath = '/activities.json';
const heartPath = '/activities/heart/date/today/1d/1min.json';


const refreshTokens = () => {
  return new Promise((resolve, reject) => {
    db.get('tokens', (error, value) => {
      if (error) reject(error);

      const {access_token, refresh_token} = JSON.parse(value);

      client.refreshAccessToken(access_token, refresh_token)
        .then(({access_token, refresh_token}) => {
          const newTokens = {access_token, refresh_token};

          db.put('tokens', JSON.stringify(newTokens), (error) => {
            if (error) reject(error);
            console.log('put new tokens in.');
            resolve(access_token);
          });
        }).catch(error => reject(error));
    });
  });
};


const getLifetimeDistance = (access_token) => {
  return new Promise((resolve, reject) => {
    client.get(lifetimePath, access_token, process.env.USER_ID)
      .then(([result]) => resolve(parseInt(result.lifetime.total.distance)))
      .catch(error => reject(error));
  });
};

const getStoredLifetimeDistance = () => {
 return new Promise((resolve, reject) => {
    db.get('lifetime', (error, value) => {
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

const getCurrentHeartRate = (access_token) => {
  return new Promise((resolve, reject) => {
    client.get(heartPath, access_token, process.env.USER_ID)
      .then(([results]) => resolve(parseInt(results['activities-heart-intraday']['dataset'].pop().value)))
      .catch(error => reject(error));
  });
};

const getStoredHeartRate = () => {
 return new Promise((resolve, reject) => {
    db.get('heartrate', (error, value) => {
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
    .then(access_token => getLifetimeDistance(access_token))
    .then(distance => storeLifetimeDistance(distance))
    .catch(error => console.log('error saving distance to db:', error));
};

const updateHeartrate = () => {
  refreshTokens()
   .then(access_token => getCurrentHeartRate(access_token))
   .then(rate => storeHeartRate(rate))
   .catch(error => console.log('error saving heartrate to db:', error));
}

module.exports = { updateLifetimeDistance, updateHeartrate, getStoredHeartRate, getStoredLifetimeDistance };