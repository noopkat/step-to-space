require('dotenv').config();
const FitbitApiClient = require('fitbit-node');
const azure = require('azure-storage');
const tableService = azure.createTableService(process.env.TABLE_ACCOUNT, process.env.TABLE_KEY);

const client = new FitbitApiClient(process.env.CLIENT_ID, process.env.SECRET);
const lifetimePath = '/activities.json';
const heartPath = '/activities/heart/date/today/1d/1min.json';

const refreshTokens = () => {
  return new Promise((resolve, reject) => {
    tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', (error, result) => {
      if (error) reject(error);

      const {access_token, refresh_token} = JSON.parse(result.tokens._);

      client.refreshAccessToken(access_token, refresh_token)
        .then(({access_token, refresh_token}) => {
          const tokens = {'_': JSON.stringify({access_token, refresh_token})};

          // sadface
          // const entity = {...result, tokens};
          const entity = Object.assign({}, result, {tokens});

          tableService.mergeEntity(process.env.TABLE_NAME, entity, (error) => {
            if (error) return reject(error);
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
    tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', (error, result) => {
      return error ? reject(error) : resolve(result.lifetime._);
    });
  });
};

const storeLifetimeDistance = (distance) => {
  return new Promise((resolve, reject) => {
    tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', (error, result) => {
      if (error) return reject(error);
      const lifetime = {'_': distance};
      const entity = Object.assign({}, result, {lifetime});

      tableService.mergeEntity(process.env.TABLE_NAME, entity, (error) => {
        return error ? reject(error) : resolve();
      });
    });
  });
};

const getCurrentHeartRate = (access_token) => {
  return new Promise((resolve, reject) => {
    client.get(heartPath, access_token, process.env.USER_ID)
      .then(([results]) => resolve(results['activities-heart-intraday']['dataset'].pop().value))
      .catch(error => reject(error));
  });
};

const getStoredHeartRate = () => {
 return new Promise((resolve, reject) => {
    tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', (error, result) => {
      return error ? reject(error) : resolve(result.heartrate._);
    });
  });
};

const storeHeartRate = (rate) => {
  return new Promise((resolve, reject) => {
    tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', (error, result) => {
      if (error) return reject(error);
      const heartrate = {'_': rate};
      const entity = Object.assign({}, result, {heartrate});

      tableService.mergeEntity(process.env.TABLE_NAME, entity, (error) => {
        return error ? reject(error) : resolve();
      });
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