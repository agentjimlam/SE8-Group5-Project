// Map component, it pre-loads all 5138 bus stops and displays them via markers

// NOTE: Map.jsx is a map component for TESTING PURPOSES. 
// It includes a LocationFinder function, which allows you to click on the leaflet Map and it will console log the Latitude and Longitude 

import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import LocationMarker from "./LocationMarker";
import { useEffect, useState } from "react";
import { BUS_STOPS, busApi } from "./apiUtils";

const blueBusIcon = L.icon({
  iconUrl: "/bus-icon-blue_600x600px.png", // Specify the path to your custom icon
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon (the point where it is centered)
  popupAnchor: [0, -32], // Popup anchor point
});

function Map() {
  const [isLoading, setIsLoading] = useState(false);
  const [busStops, setBusStops] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function fetchBusStops() {
      // the Datamall only return 500 records at a time.
      // Counter to increase by 500 every loop.
      // Check the length of the return list.
      // If the list is less than 500, this is the last
      // records.
      const tempList = [];
      let i = 0;
      let dataLen = 0;
      do {
        const params = { $skip: i };
        try {
          setIsLoading(true);
          const response = await busApi.get(BUS_STOPS, { params });
          dataLen = response.data.value.length; // if 500 continue
          // MUST NOT use [], push individual items.
          tempList.push(...response.data.value);
          //console.log("Bus stops len ", tempList.length);
          // next 500 records
          i = i + 500;
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } while (dataLen === 500);
      // set the bus services list to this temp list
      if (!ignore) {
        setBusStops(tempList);
      }
    }
    // call fetch data
    fetchBusStops();
    // clean up the connection
    return () => {
      ignore = true;
    };
  }, []);

  // Function that console logs the latitude longitude co-ordinates of where you click on the map
  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(e) {
        console.log("Co-ordinates clicked", e.latlng);
      },
    });
    return null;
  };

  return (
    <div className={styles.container}>
      <h2>Map example</h2>
      <MapContainer
        center={[1.2929, 103.852]} // City hall co-ordinates
        zoom={15}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {busStops.map((busStop) => (
          <Marker
            key={busStop.BusStopCode}
            position={[busStop.Latitude, busStop.Longitude]}
            icon={blueBusIcon}
          >
            <Popup>
              <div>
                Bus stop name: {busStop.Description}{" "}
                {/*Bus Stop Name eg. Opp Tanglin View*/}
                <br />
                {busStop.BusStopCode}, {busStop.RoadName}{" "}
                {/*eg. 10271, Alexandra Rd*/}
              </div>
            </Popup>
          </Marker>
        ))}
        <LocationMarker />
        <LocationFinderDummy />
      </MapContainer>
    </div>
  );
}

export default Map;
