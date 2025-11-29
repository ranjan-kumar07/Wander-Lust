// mapboxgl.accessToken = mapToken;
    

// let defaultCoordinates = [85.2722, 25.9644]; // YOUR default location (lng, lat)

// // If coordinates exist and length is 2 and both are numbers → use them
// let finalCoordinates = (listing.geometry && 
//     listing.geometry.coordinates &&
//     listing.geometry.coordinates.length === 2 &&
//     typeof listing.geometry.coordinates[0] === "number" &&
//     typeof listing.geometry.coordinates[1] === "number")
//     ? listing.geometry.coordinates
//     : defaultCoordinates;
    
//     const map = new mapboxgl.Map({
//         container: 'map', // container ID
        
//         center:finalCoordinates , // starting position [lng, lat]. Note that lat must be set between -90 and 90
//         zoom: 9 // starting zoom
//     });

   

//     const marker1 = new mapboxgl.Marker({ color: 'red'})
//         .setLngLat(finalCoordinates)
//         .setPopup(new mapboxgl.Popup({offset: 25})           
//            .setHTML(
//             `<h4> ${listing.title}</h4> <p>Exact location provided after booking </p>`))

//         .addTo(map);


// public/js/map.js
(function () {
  if (typeof mapboxgl === 'undefined') {
    console.error('Mapbox GL JS not loaded. Did you include the Mapbox script in the page?');
    return;
  }

  const token = window.MAP_TOKEN;
  if (!token) {
    console.error('MAPBOX_TOKEN not provided. Make sure your route passes mapToken and your template sets window.MAPBOX_TOKEN.');
    return;
  }

  mapboxgl.accessToken = token;

  const listing = window.LISTING_DATA || null;
  const defaultCoordinates = [85.2722, 25.9644]; // [lng, lat]

  function isValidCoords(coords) {
    return Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === 'number' &&
      typeof coords[1] === 'number' &&
      Math.abs(coords[0]) <= 180 &&
      Math.abs(coords[1]) <= 90;
  }

  const finalCoordinates = (listing && listing.geometry && isValidCoords(listing.geometry.coordinates))
    ? listing.geometry.coordinates
    : defaultCoordinates;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: finalCoordinates,
    zoom: 9
  });

  const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(finalCoordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h4>${(listing && listing.title) ? listing.title : 'Listing'}</h4><p>Exact location provided after booking</p>`))
    .addTo(map);

  // If this page is "new" (no listing data), let user click to set coords (saves to hidden input)
  if (!listing) {
    map.on('click', function (e) {
      const coords = [e.lngLat.lng, e.lngLat.lat];
      marker.setLngLat(coords);
      let coordInput = document.querySelector('input[name="geometry.coordinates"]');
      if (!coordInput) {
        coordInput = document.createElement('input');
        coordInput.type = 'hidden';
        coordInput.name = 'geometry.coordinates';
        document.querySelector('form')?.appendChild(coordInput);
      }
      coordInput.value = JSON.stringify(coords);
    });
  }
})();

    