const levelup = require('levelup');
const db = levelup('./fitbitdb');

db.get('distance', function(err, value) {
  if (err) throw err;
  console.log('distance:', value);
});

db.get('tokens', function(err, value) {
  if (err) throw err;
  console.log('tokens:', value);
});