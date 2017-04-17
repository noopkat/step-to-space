const levelup = require('levelup');
const db = levelup('./fitbitdb');
 
const ops = [
  { type: 'put', key: 'distance', value: 11.54 },
  { type: 'put', key: 'heartrate', value: 74 },
  { type: 'put', key: 'lifetime', value: 1772 },
  { type: 'put', key: 'tokens', value: JSON.stringify({access_token: process.env.ACCESS_TOKEN, refresh_token: process.env.REFRESH_TOKEN}) }
];
 
db.batch(ops, function (err) {
  if (err) return console.log('Ooops!', err)
  console.log('Batch success.')
});