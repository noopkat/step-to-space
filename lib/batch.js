const levelup = require('levelup');
const db = levelup('./fitbitdb');
 
const ops = [
  { type: 'put', key: 'distance', value: 11.54 },
  { type: 'put', key: 'heartrate', value: 80 },
  { type: 'put', key: 'lifetime', value: 0 },
  { type: 'put', key: 'tokens', value: JSON.stringify({access_token: process.env.ACCESS_TOKEN, refresh_token: process.env_REFRESH_TOKEN}) }
];
 
db.batch(ops, function (err) {
  if (err) return console.log('Ooops!', err)
  console.log('Batch success.')
});