import axios from "axios";

export const BASE_URL = `${import.meta.env.VITE_API_URL}/ltaodataservice`; // https://datamall2.mytransport.sg/ltaodataservice
export const BUS_ARRIVAL = "/v3/BusArrival"; 
export const BUS_SERVICES = "/BusServices";
export const BUS_ROUTES = "/BusRoutes";
export const BUS_STOPS = "/BusStops";
 
const headers = {
  AccountKey: import.meta.env.VITE_LTA_API_KEY,
  Accept: 'application/json',
};

export const busApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: headers,
})

// Vite proxy method only works in development mode
// CORS-anywhere method should be used for testing and development purpose only since here you're using someone else's proxy server to call the API