/**
 * Components for tracking nearest bus stops of a bus route.
 */
import { useContext } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BusStopsContext, UniqueStopListContext, 
  BusStopsLoadingContext } from "./BusStopsContext";
import { BusServicesContext, UniqueBusServicesContext,
  BusServicesLoadingContext
 } from "./BusServicesContext";
import { BusRoutesContext, BusRoutesLoadingContext } from "./BusRoutesContext";


export function BusRoutesTest(){
  // Loading the context.
  // load the bus stops related context
  const busStopsCtx = useContext(BusStopsContext);
  const uniqueStopListCtx = useContext(UniqueStopListContext);
  const busStopsLoadingCtx = useContext(BusStopsLoadingContext);
  // load the bus services related context
  const busServicesCtx = useContext(BusServicesContext);
  const uniqueServicesCtx = useContext(UniqueBusServicesContext);
  const busServicesLoadingCtx = useContext(BusServicesLoadingContext);
  // load bus routes
  const busRoutesCtx = useContext(BusRoutesContext);
  const busRoutesLoadingCtx = useContext(BusRoutesLoadingContext);
  // states related to tracking
  // states for stopDistances = [{busStopCode: busStopCode, 
  //    distance: distance}] -- distance from each bus stop in
  //    the route.
  const [stopDistances, setStopDistances] = useState([]);
  // states of the current location. This will be used to calculate
  // the differences in distances of all the bus stops.
  // coordinate in (lat, lng) format.
  // Need to make a call to the build-in Javascript navigator 
  // function.
  const [currentCoordinate, setCurrentCoordinate] = useState({lat: 0.0, lng: 0.0});
  // To get the place name, need to get reverse geo-coding
  // to HERE API. 
  const [currentPlaceName, setCurrentPlaceName] = useState(null);
  // Error message for any errors that can occur
  const [errorMessage, setErrorMessage] = useState(null);

  // Content depends on the loading state
  let content;
  // Make sure bus stops, services and routes are already loaded.
  if(!busStopsLoadingCtx && !busServicesLoadingCtx
      &&busRoutesLoadingCtx
  ){
    content = (<h3>Loading ...</h3>);
  }
  // The bus stops has finished loaded
  content = (
    <>
      <h2>Bus routes with tracking</h2>
      <h2>Test Data --- Start ---</h2>
      <h3>Loading: {busStopsLoadingCtx}</h3>
      <h3>stop 0: {uniqueStopListCtx[0]}</h3>
      <h3>stop 1: {uniqueStopListCtx[1]}</h3>
      <h3>Length of bus stops: {busStopsCtx.length}</h3>
      <h3>Length of bus stops: {busStopsCtx.length}</h3>
      <h3>Number of bus stops: {uniqueStopListCtx.length}</h3>
      <h3>Number of bus services: {busServicesCtx.length}</h3>
      <h3>Number of bus routes: {busRoutesCtx.length} (the longest time, wait untill the number appears for bus routes to be loaded)</h3>
      <h3>Bus service 0: {uniqueServicesCtx[0]}</h3>
      <h3>Bus service 1: {uniqueServicesCtx[1]}</h3>
      <h2>Test Data --- End ---</h2>
    </>
  )

  return(
    <>
    {content}
    
    </>
  )
}