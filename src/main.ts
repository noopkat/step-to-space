const dist: HTMLElement = document.getElementById('dist');
const laps: HTMLElement = document.getElementById('laps');
const heart: HTMLElement = document.getElementById('heart2');

const spaceStationDistance = 320;

declare var ISS_TLE_1 :any; // globals in index.html
declare var ISS_TLE_2 :any; // for the Two Line Element set with ISS trajectory data.
/*
fetch('/api/distance')
  .then((response: any) => response.json())
  .then(({ distance }) => {
    console.log(distance);
    dist.innerHTML = `${distance}km`;
    const numLaps = Math.floor(distance / spaceStationDistance);
    laps.innerHTML = numLaps.toString();
  });

fetch('/api/heart')
  .then((response: any) => response.json())
  .then(({ heartrate }) => {
    console.log(heartrate);
    const aLength = (60 / heartrate) /2;
    heart.style.animation = `pounding ${aLength}s linear infinite alternate`;
  });
*/


fetch('/api/tle')
.then(function(response) {
  return response.json()
}).then(function(tle) 
{
  var _tle = JSON.parse(tle.position);
      ISS_TLE_1 = _tle.TLE1;
      ISS_TLE_2 = _tle.TLE2;
      console.log(tle);
});