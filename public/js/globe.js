var width = 470, height = 240;
var longitude =0;

var lt =-51;
var ln=-15;
var projection = d3.geo
  .orthographic()
  .scale(100)
  .translate([width / 2, height / 2])
  .clipAngle(90)
  .precision(0.1);

var path = d3.geo.path().projection(projection);
var svg = d3
  .select("#worldContainer")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg
  .append("defs")
  .append("path")
  .datum({ type: "Sphere" })
  .attr("id", "sphere")
  .attr("d", path);

svg.append("use").attr("class", "stroke").attr("xlink:href", "#sphere");

svg.append("use").attr("class", "fill").attr("xlink:href", "#sphere");

 

d3.json('/data/world-50m.json',
  function(error, world) {
    if (error) 
   {
       console.log(error);
        throw error;
  }
    svg
      .insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    svg
      .insert("path", ".graticule")
      .datum(
        topojson.mesh(world, world.objects.countries, function(a, b) {
          return a !== b;
        })
      )
      .attr("class", "boundary")
      .attr("d", path);
  }
);

d3.select(self.frameElement).style("height", height + "px");

var myVar = setInterval(myTimer, 1000);

function myTimer() {


/*
  var tleLine1 =  '1 25544U 98067A   17242.56063421  .00016717  00000-0  10270-3 0  9000',
  tleLine2 = '2 25544  51.6398  27.5636 0004825 206.9358 153.1545 15.54034441 33310';
  */
  // Initialize a satellite record
  var satrec = satellite.twoline2satrec(ISS_TLE_1, ISS_TLE_2);

  //  Or you can use a JavaScript Date
  var positionAndVelocity = satellite.propagate(satrec, new Date()); 

  // The position_velocity result is a key-value pair of ECI coordinates.
  // These are the base results from which all other coordinates are derived.
  var positionEci = positionAndVelocity.position,
  velocityEci = positionAndVelocity.velocity;
  var gmst = satellite.gstimeFromDate(new Date());
  
  // You can get ECF, Geodetic, Look Angles, and Doppler Factor.
  var positionEcf   = satellite.eciToEcf(positionEci, gmst),
      positionGd    = satellite.eciToGeodetic(positionEci, gmst);
     
  
  // The coordinates are all stored in key-value pairs.
  // ECI and ECF are accessed by `x`, `y`, `z` properties.
  var satelliteX = positionEci.x,
      satelliteY = positionEci.y,
      satelliteZ = positionEci.z;
  
 
  
  // Geodetic coords are accessed via `longitude`, `latitude`, `height`.
  var longitude = positionGd.longitude,
      latitude  = positionGd.latitude,
      height    = positionGd.height;
  
 

ISS_longitude  = satellite.degreesLong(longitude)
ISS_latitiude =  satellite.degreesLat(latitude);


  const ISS_position = [(ISS_longitude*-1)+60,ISS_latitiude*-1];
  projection.rotate(ISS_position);
  console.log(JSON.stringify(ISS_position));
  svg.selectAll("path").attr("d", path);
}