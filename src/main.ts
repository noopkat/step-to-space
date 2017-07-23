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

  interface parcel {
    label: string;
    imageFilename: string;
  }

  interface IDatedParcelList {
    [propName: string]: parcel;
  }

  const miscParcelList: parcel[] = [
     {
       label: "beef jerky",
       imageFilename: "jerky.png"
     },
     {
       label: "space icecream",
       imageFilename: "icecream.png"
     },
     {
       label: "kitten",
       imageFilename: "kitten.png"
     },
     {
       label: "space sushi",
       imageFilename: "sushi.png"
     },
     {
       label: "toilet paper",
       imageFilename: "toiletpaper.png"
     }
  ];
  
  // change this to a nested structure ie. [month][day]
  const datedParcelList: IDatedParcelList = {
    '23-0': {
      label: "Jack D. Fischer's birthday cake",
      imageFilename: "cake.png"
    },
    '3-0': {
      label: "Commander Fyodor Yurchikhin's birthday cake",
      imageFilename: "cake.png"
    },
    '9-1': {
      label: "Dr. Peggy A. Whitson's birthday cake",
      imageFilename: "cake.png"
    }
  };

/*
  space icecrem
  kittens in space
  telescope
  space sushi
  beer
  coffee
  kimchi
  tea
  fruit rollups
  toilet paper
  shrubbery
  laptop
  tim tams
  sonic scredriver
  3d filament
  pizza
  a towel 25th may
  space pen
  fidget spinner
  tang
  batteries
  arduinos
  solarpanels
  sunglasses
  milo*/

  interface astrodata {
    distance: number;
    numlaps: number;
    position: number;
    progress: number;
    classname: string;
  }

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
    const {position, progress, classname} = data;

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

  const updateSentence = function(data: astrodata) {
    const {distance, numlaps} = data;
    
    // update sentence UI
    dist.textContent = `${distance}km`;
    laps.textContent = numlaps.toString();
  };

  const updateParcel = function() {
    const today = new Date();
    const prop = `${today.getDate()}-${today.getMonth()}`;
    let parcel;

    if (datedParcelList[prop]) {
      parcel = datedParcelList[prop];
    } else {
      const index = Math.floor(Math.random() * miscParcelList.length); 
      console.log('index:', index);
      parcel = miscParcelList[index];
    }
    parcelContainer.textContent = parcel.label;
  };

  // for debugging
  // let i = 0;
  // setInterval(() => {
  //   calculateAstronaut(i++).then((data: astrodata) => updateAstronaut(data));
  // }, 10);
  

  fetch('/api/distance')
    .then((response: any) => response.json())
    .then(({ distance }) => calculateAstronaut(250))
    .then((data: astrodata) => {
      updateAstronaut(data);
      updateSentence(data);
      updateParcel();
    }); 

  fetch('/api/heart')
    .then((response: any) => response.json())
    .then(({ heartrate }) => updateHeart(heartrate));

})();
