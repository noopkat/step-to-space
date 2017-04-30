require('dotenv').config();
const azure = require('azure-storage');
const tableService = azure.createTableService(process.env.TABLE_ACCOUNT, process.env.TABLE_KEY);
const uuid = require('uuid/v4');

const tokensEnt = JSON.stringify({access_token: process.env.ACCESS_TOKEN, refresh_token: process.env.REFRESH_TOKEN})
const entGen = azure.TableUtilities.entityGenerator;
const entity = {
  PartitionKey: entGen.String('data'),
  RowKey: entGen.String('current'),
  heartrate: entGen.Int32(74),
  lifetime: entGen.Int32(1772),
  tokens: entGen.String(tokensEnt)
};

tableService.retrieveEntity(process.env.TABLE_NAME, 'data', 'current', function(error, result, response) {
  if (!error) {
    // console.log(result);
    console.log('no error retrieving');
  }
});

// tableService.insertEntity(process.env.TABLE_NAME, entity, function(error, result, response) {
//   if (!error) {
//     console.log('Batch success.', result);
    
//   } else {
//     return console.log('Error:', error);
//   }
// });
