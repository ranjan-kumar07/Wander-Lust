mapboxgl.accessToken = mapToken;
    

let defaultCoordinates = [85.2722, 25.9644]; // YOUR default location (lng, lat)

// If coordinates exist and length is 2 and both are numbers → use them
let finalCoordinates = (listing.geometry && 
    listing.geometry.coordinates &&
    listing.geometry.coordinates.length === 2 &&
    typeof listing.geometry.coordinates[0] === "number" &&
    typeof listing.geometry.coordinates[1] === "number")
    ? listing.geometry.coordinates
    : defaultCoordinates;
    
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        
        center:finalCoordinates , // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

   

    const marker1 = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(finalCoordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})           
           .setHTML(
            `<h4> ${listing.title}</h4> <p>Exact location provided after booking </p>`))

        .addTo(map);

    