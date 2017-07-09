(function() {
  const dist: HTMLElement = document.getElementById('dist');
  const laps: HTMLElement = document.getElementById('laps');
  const heart: HTMLElement = document.getElementById('heart2');
  const astronaut: HTMLElement = document.getElementById('astronaut');
  const astronautContainer: HTMLElement = document.getElementById('astronautContainer');
  const iss: HTMLElement = document.getElementById('iss');
  const parcelContainer: HTMLElement = document.getElementById('parcelContainer');

  const spaceStationDistance = 640; // doubled for one 'lap'
  const pixelSpaceStationDistance = 700;

  interface astrodata {
    distance: number;
    numlaps: number;
    position: number;
    progress: number;
    classname: string;
  };

  const calculateAstronaut = function(distance: number) {
    return new Promise((resolve, reject) => {
      console.log(distance);

      // calculate new distance properties
      const numlaps = Math.floor(distance / spaceStationDistance);
      const lapRemainder = distance % spaceStationDistance;
      const lapProgress = lapRemainder / spaceStationDistance;
      const position = (lapProgress > .5) ? pixelSpaceStationDistance - ((lapProgress - .5) * pixelSpaceStationDistance * 2) : lapProgress * pixelSpaceStationDistance * 2;
      const classname = (lapProgress > .5) ? 'facingEarth' : '';
      const progress = Math.floor(lapProgress * 100);

      console.log(`remainder: ${lapRemainder} progress: ${lapProgress}`);

      return resolve({distance, numlaps, position, progress, classname});
    });
  }

  const updateAstronaut = function(data: astrodata) {
    const {distance, numlaps, position, progress, classname} = data;

    // update sentence UI
    dist.textContent = `${distance}km`;
    laps.textContent = numlaps.toString();

    // update astronaut UI
    astronaut.className = classname;
    astronautContainer.className = classname;
    astronautContainer.style.left = `${position}px`;
    astronaut.textContent =  `astro ${progress}%`;
    astronautContainer.style.opacity = '1';
  };

  const updateHeart = function(heartrate: number) {
    console.log(heartrate);
    const aLength = (60 / heartrate) / 2;
    heart.style.animation = `pounding ${aLength}s linear infinite alternate`;
  };


  // for debugging
  // let i = 0;
  // setInterval(() => {
  //   calculateAstronaut(i++).then((data: astrodata) => updateAstronaut(data));
  // }, 10);
  

  fetch('/api/distance')
    .then((response: any) => response.json())
    .then(({ distance }) => calculateAstronaut(250))
    .then((data: astrodata) => updateAstronaut(data)); 

  fetch('/api/heart')
    .then((response: any) => response.json())
    .then(({ heartrate }) => updateHeart(heartrate));

})();
