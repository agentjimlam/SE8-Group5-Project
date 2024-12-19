import { useState, useEffect, useRef, useContext } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./MapMain.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";
import axios from "axios";

import busMarker from "../assets/busMarker.png";
import userMarker from "../assets/userMarker.png";
import { AuthContext } from "../store/auth-context";

// This is the Main Map component used in the App. NOTE: MapMain.jsx uses CORS Anywhere to get LTA Datamall API, does not use Vite proxy method.
function MapMain() {
  // Step 4: Apply the useContext hook
  const userCtx = useContext(AuthContext);
  const { currentUsername } = userCtx; // Destructure userCtx

  const [busStopsCollection, setBusStopsCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBusStop, setSelectedBusStop] = useState(null); // Store selected bus stop
  const [busStopDetails, setBusStopDetails] = useState([]); // Store details from the Bus Arrival API
  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 17);
          }
        },
        (error) => {
          console.error("Turn on location:", error);
        }
      );
    } else {
      console.error("Turn on location if not something else is wrong.");
    }
  }, []);

  // BusStops API fetch
  const fetchBusStops = async () => {
    setIsLoading(true);
    let skip = 0;
    const limit = 500;
    let hasMore = true; // hasMoreRecords
    const busStops = [];

    while (hasMore) {
      try {
        const response = await axios.get(
          `https://cors-anywhere.herokuapp.com/https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`,
          {
            headers: {
              AccountKey: import.meta.env.VITE_LTA_API_KEY, // replaced the actual API Key, use env variable to protect
              accept: "application/json",
            },
          }
        );

        const newBusStops = response.data.value;

        newBusStops.forEach((stop) => {
          busStops.push({
            BusStopCode: stop.BusStopCode,
            RoadName: stop.RoadName,
            Description: stop.Description,
            Latitude: stop.Latitude,
            Longitude: stop.Longitude,
          });
        });

        if (newBusStops.length < limit) {
          hasMore = false;
        }

        skip += limit;
      } catch (err) {
        console.error(err);
        hasMore = false;
      }
    }

    setBusStopsCollection(busStops);
    setIsLoading(false);
  };

  // Fetch next Bus Arrival details for User selected Bus Stop. Data from LTA BusArrival
  const fetchBusStopDetails = async (busStopCode) => {
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`,
        {
          headers: {
            AccountKey: import.meta.env.VITE_LTA_API_KEY, // replaced the actual API Key, use env variable to protect
            accept: "application/json",
          },
        }
      );
      setBusStopDetails(response.data.Services);
    } catch (err) {
      console.error(err);
    }
  };

  const cIcon = new icon({
    // iconUrl: require("../assets/busMarker.png"), does not work in vite
    iconUrl: busMarker, // photo is in assets folder
    iconSize: [30, 30],
  });
  const userIcon = new icon({
    // iconUrl: require("../assets/userMarker.png")
    iconUrl: userMarker,
    iconSize: [35, 35],
  });

  const getMinutesUntilArrival = (estimatedArrival) => {
    const currentTime = new Date();
    const arrivalTime = new Date(estimatedArrival);
    const diffInMs = arrivalTime - currentTime;
    const diffInMinutes = Math.round(diffInMs / 1000 / 60);
    return diffInMinutes > 0 ? diffInMinutes + " Mins" : "Arrived";
  };

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
      {/* <h1>Map Main</h1> */}
      <p className={styles.busArrivalIntroText}>
        Hello{currentUsername ? ` ${currentUsername}` : ""}! Enable your location and we will find you. Click the{" "}
        <strong>Get Bus Stops button</strong> to get all the nearest Bus Stops
        then click on the Bus Stop you want to show the Bus Arrival times of.
      </p>

      <div className={styles.mapContainer}>
        <MapContainer
          center={[1.3521, 103.8198]}
          zoom={17}
          className={styles.map}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {busStopsCollection.map((busStop) => (
            <Marker
              key={busStop.BusStopCode}
              position={[busStop.Latitude, busStop.Longitude]}
              icon={cIcon}
              eventHandlers={{
                click: () => {
                  setSelectedBusStop(busStop);
                  fetchBusStopDetails(busStop.BusStopCode);
                },
              }}
            >
              <Popup>
                <div>
                  {`${busStop.Description}`}
                  {/*eg. Opp Tanglin View*/}
                  <br />
                  {`${busStop.BusStopCode} | ${busStop.RoadName}`}
                  {/*eg. 10271 | Alexandra Rd*/}
                </div>
              </Popup>
            </Marker>
          ))}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>Your Current Location</Popup>
            </Marker>
          )}
          <LocationFinderDummy />
        </MapContainer>
      </div>

      <button
        onClick={fetchBusStops}
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? "Loading..." : "Get Bus Stops"}
      </button>

      {selectedBusStop && (
        <div className={styles.busArrivalTimelistContainer}>
          <h3>
            Bus Arrival Timings for Bus Stop {selectedBusStop.BusStopCode}
          </h3>
          <table className={styles.busArrivalTable}>
            <thead>
              <tr>
                <th>Service No</th>
                <th>Next Bus Arrival</th>
                <th>Upcoming Bus Arrival</th>
              </tr>
            </thead>
            <tbody>
              {busStopDetails.map((service, index) => (
                <tr key={index}>
                  <td>{service.ServiceNo}</td>
                  <td>
                    {getMinutesUntilArrival(service.NextBus.EstimatedArrival)}
                  </td>
                  <td>
                    {getMinutesUntilArrival(service.NextBus2.EstimatedArrival)}{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MapMain;
