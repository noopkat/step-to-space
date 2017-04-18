const dist: HTMLElement = document.getElementById('dist');
const laps: HTMLElement = document.getElementById('laps');
const heart: HTMLElement = document.getElementById('heart2');

const spaceStationDistance = 320;

fetch('/api/distance')
  .then((response: any) => response.json())
  .then((results: any) => {
    console.log(results);
    const totalDistance = parseInt(results.distance);
    dist.innerHTML = `${totalDistance}km`;
    const numLaps = Math.floor(totalDistance / spaceStationDistance);
    laps.innerHTML = numLaps.toString();
  });

fetch('/api/heart')
  .then((response: any) => response.json())
  .then((results: any) => {
    console.log(results);
    const bpm = parseInt(results.heartrate);
    const aLength = (60 / bpm) /2;
    heart.style.animation = `pounding ${aLength}s linear infinite alternate`;
  });
