/**The main bus page that will download the bus stops, bus routes, and
 * the bus services for the BusArrival page.
 */

// imports to use Leaflet, and react-leaflet. Note: they are 2 separate packages
import styles from "./BusMain.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Ensure you have Leaflet's CSS

import { useState, useEffect, useMemo } from "react";
import { busApi, BUS_STOPS, BUS_SERVICES, BUS_ROUTES } from "./apiUtils";
import {
  BusRoutesContext,
  BusServicesContext,
  BusStopsContext,
  UniqueBusServicesContext,
  UniqueStopListContext,
} from "./BusContext";
import { BusArrival } from "./BusArrival";
import { BusRoutes } from "./BusRoutes";

import LocationMarker from "./LocationMarker";

const blueBusIcon = L.icon({
  iconUrl: "/bus-icon-blue_600x600px.png", // Specify the path to your custom icon
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon (the point where it is centered)
  popupAnchor: [0, -32], // Popup anchor point
});

export function BusMain() {
  // List of initial variables need to display the bus
  // stops for user to select.
  const [busServices, setBusServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busStops, setBusStops] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);

  // Fetch the bus routes
  // Fetch the list of bus stops with names. No dependency.
  // Fetch the list of bus services. No dependency
  useEffect(() => {
    let ignore = false;
    async function fetchBusRoutes() {
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
          const response = await busApi.get(BUS_ROUTES, { params });
          dataLen = response.data.value.length; // if 500 continue
          // MUST NOT use [], push individual items.
          tempList.push(...response.data.value);
          //console.log("Bus routes len ", tempList.length);
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
        setBusRoutes(tempList);
      }
    }
    // call fetch data
    fetchBusRoutes();
    // clean up the connection
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch the list of bus stops with names. No dependency.
  // Fetch the list of bus services. No dependency
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
  // Put the bus stops into a unique list
  // use memo for the unique service no
  const uniqueStopList = useMemo(() => {
    // Get unique service no.
    function getUniqueStopList() {
      const newList = [];
      if (!isLoading && busStops.length > 0) {
        // Get the unique bus stops
        // Actually every bus stops is unique.
        // So, just put the BusStopCode into a new list.
        for (let i = 0; i < busStops.length; i++) {
          newList.push(busStops[i]["BusStopCode"]);
        }
      }
      return newList;
    }
    // MUST return the list from the function call
    return getUniqueStopList();
  }, [busStops, isLoading]);

  // Fetch the list of bus services. No dependency
  useEffect(() => {
    let ignore = false;
    async function fetchBusServices() {
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
          const response = await busApi.get(BUS_SERVICES, { params });
          dataLen = response.data.value.length; // if 500 continue
          // MUST NOT use [], push individual items.
          tempList.push(...response.data.value);
          //console.log("Bus services len ", tempList.length);
          // next 500 records
          i = i + 500;
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } while (dataLen === 500);
      // set the bus services list to this temp list
      setBusServices(tempList);
    }
    // call fetch data
    fetchBusServices();
    // clean up the connection
    return () => {
      ignore = true;
    };
  }, []);

  // use memo for the unique service no
  const uniqueServiceNo = useMemo(() => {
    // Get unique service no.
    function getUniqueServiceNo() {
      const newList = [];
      if (!isLoading && busServices.length > 0) {
        // Get the unique bus stops
        for (let i = 0; i < busServices.length; i++) {
          if (newList.includes(busServices[i]["ServiceNo"])) {
            continue; // skip
          } else {
            newList.push(busServices[i]["ServiceNo"]);
          }
        }
      }
      return newList;
    }
    // MUST return the list from the function call
    return getUniqueServiceNo();
  }, [busServices, isLoading]);

  return (
    <>
      {isLoading && <p>Loading ...</p>}
      {!isLoading &&
        busServices.length > 0 &&
        uniqueServiceNo.length > 0 &&
        busStops.length > 0 &&
        uniqueStopList.length > 0 && (
          <div>
            <h1>Bus Info Service</h1>
            <p>Trivia</p>
            <p>Number of unique bus services: {uniqueServiceNo.length}</p>
            <p>Number of bus stops: {uniqueStopList.length}</p>
            <BusStopsContext.Provider value={busStops}>
              <BusServicesContext.Provider value={busServices}>
                <BusRoutesContext.Provider value={busRoutes}>
                  <UniqueStopListContext.Provider value={uniqueStopList}>
                    <UniqueBusServicesContext.Provider value={uniqueServiceNo}>
                      <BusArrival />
                      <BusRoutes />
                    </UniqueBusServicesContext.Provider>
                  </UniqueStopListContext.Provider>
                </BusRoutesContext.Provider>
              </BusServicesContext.Provider>
            </BusStopsContext.Provider>
          </div>
        )}
    </>
  );
}
