import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Ensure you have Leaflet's CSS
import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";

// A custom default Leaflet marker icon but red color
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [bbox, setBbox] = useState([]); // to store react-leaflet's bounding box's 2 points of co-ordinates, south-west point and north-east point

  const map = useMap(); // useMap() gives you a reference to the Leaflet map object that is currently being used in the react-leaflet map container.

  // [map] dependency: runs every time map is re-rendered
  // map.locate() is a method provided by Leaflet that triggers the browser's Geolocation API to attempt to determine the user's location.
  // The on() method attaches an event listener for the locationfound event.
  // When the locationfound event is triggered, the provided callback function is executed. The argument e is an event object that contains useful information about the user's location.
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);

      // map.flyTo(latlng, zoom, options), Leaflet Method that makes map do fly-to animation to X location. Here it flies to user location
      map.flyTo(e.latlng, map.getZoom());
      // const radius = e.accuracy; 
      // e.accuracy is accuracy of the location, measured in meters (i.e., the radius around the location that the user's actual position could be within).

      // L.circle(latlng, radius, options), Leaflet Method to create circular marker. 100 is radius input, in metres
      const circle = L.circle(e.latlng, 100); 
      circle.addTo(map); // adds the circle to map
      setBbox(e.bounds.toBBoxString().split(",")); // e.bounds.toBBoxString() is a Leaflet method that converts the bounding box (LatLngBounds) into a comma-separated string format.
      // e.bounds is a LatLngBounds object in Leaflet, which contains two points: the southwest and northeast corners of the rectangular bounding box.
      // console.log("bbox", bbox); 
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={redIcon}>
      <Popup>
        You are here. <br />
        {/* Map bbox: <br />
        <b>Southwest lng</b>: {bbox[0]} <br />
        <b>Southwest lat</b>: {bbox[1]} <br />
        <b>Northeast lng</b>: {bbox[2]} <br />
        <b>Northeast lat</b>: {bbox[3]} */}
      </Popup>
    </Marker>
  );
}

export default LocationMarker;
