require('dotenv').config();
const azure = require('azure-storage');
const tableService = azure.createTableService(process.env.TABLE_ACCOUNT, process.env.TABLE_KEY);

const getStoredLifetimeDistance = () => {
 return new Promise((resolve, reject) => {
    tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', (error, result) => {
      return error ? reject(error) : resolve(result.lifetime._);
    });
  });
};

const getStoredHeartRate = () => {
 return new Promise((resolve, reject) => {
    tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', (error, result) => {
      return error ? reject(error) : resolve(result.heartrate._);
    });
  });
};

module.exports = { getStoredHeartRate, getStoredLifetimeDistance };
