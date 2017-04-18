const dist: HTMLElement = document.getElementById('dist');
const laps: HTMLElement = document.getElementById('laps');
const heart: HTMLElement = document.getElementById('heart2');

const spaceStationDistance = 320;

fetch('/api/distance')
  .then((response: any) => response.json())
  .then(({ distance }) => {
    console.log(distance);
    dist.innerHTML = `${Math.floor(distance)}km`;
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
