/*
https://spaceflight.nasa.gov/realdata/sightings/SSapplications/Post/JavaSSOP/orbit/ISS/SVPOST.html

*/
require('dotenv').config();
require('define');
const cheerio = require('cheerio');
const request = require('request');

const getTLEData = () => {
    return new Promise(function(resolve, reject) {
      var obj = new Object();

     
      request('https://spaceflight.nasa.gov/realdata/sightings/SSapplications/Post/JavaSSOP/orbit/ISS/SVPOST.html', function (error, response, html) {
        if (!error && response.statusCode == 200) 
        {
          var $ = cheerio.load(html);
          var text_start = html.indexOf("TWO LINE MEAN ELEMENT SET");
          var text_end = html.indexOf("Satellite: ISS",text_start);
          var tleText = html.substring(text_start,text_end).split('\n');
          obj.TLE1 = tleText[3].trim(); // we know it's index 3 and 4 by debugging, a nicer solution would be to check which 
          obj.TLE2 = tleText[4].trim(); // index contains the data we want by a regexp.
          console.log(response.statusCode);
          var jsonString= JSON.stringify(obj);
          if (jsonString!=null) {
            resolve(jsonString);
          }
          else {
            reject(Error("Cannot get TLE data"));
          }
        };  
      });
  })};


module.exports = {getTLEData};
