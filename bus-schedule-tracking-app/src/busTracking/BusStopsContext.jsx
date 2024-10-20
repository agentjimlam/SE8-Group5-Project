/**
 * Number of request = 22.
 */

import { createContext } from "react";
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { busApi, BUS_STOPS } from "../busInfo/apiUtils";


export const BusStopsContext = createContext(null);
export const UniqueStopListContext = createContext(null);
export const BusStopsLoadingContext = createContext(null);

// PropTypes.element: A React element (ie. <MyComponent />).
BusStopsContextProvider.propTypes = {
  children: PropTypes.element,
}
export function BusStopsContextProvider({children}){
  const [busLoading, setBusLoading] = useState(false);
  const [busStops, setBusStops] = useState([]);

  // Fetch the list of bus stops with names. No dependency.
  useEffect(()=>{
    let ignore = false;
    async function fetchBusStops(){
      // the Datamall only return 500 records at a time.
      // Counter to increase by 500 every loop.
      // Check the length of the return list.
      // If the list is less than 500, this is the last
      // records.
      const tempList = [];
      let i = 0;
      let dataLen = 0;
      do {
        const params = {"$skip": i};
        try{
          setBusLoading(true);
          const response = await busApi.get(BUS_STOPS, {params});
          dataLen = response.data.value.length; // if 500 continue
          // MUST NOT use [], push individual items.
          tempList.push(...response.data.value); 
          //console.log("Bus stops len ", tempList.length);
          // next 500 records
          i = i + 500;
        } catch(error){
          console.error(error);
        }
        finally{
          setBusLoading(false);
        }
      } while(dataLen === 500);
      // set the bus services list to this temp list
      if(!ignore){setBusStops(tempList);}
    }
    // call fetch data
    fetchBusStops();
    // clean up the connection
    return (()=>{ignore = true;})
  }, [])
// Put the bus stops into a unique list
// use memo for the unique service no
const uniqueStopList = useMemo(()=>{
  // Get unique service no.
  function getUniqueStopList(){
    const newList = [];
    if(!busLoading && (busStops.length>0)){
      // Get the unique bus stops
      // Actually every bus stops is unique.
      // So, just put the BusStopCode into a new list.
      for(let i=0; i<busStops.length; i++){
          newList.push(busStops[i]["BusStopCode"]);
      }
    }
    return newList;
  }
    // MUST return the list from the function call
    return getUniqueStopList();
  }, [busStops, busLoading])  
  
  return(
    <BusStopsContext.Provider value={busStops}>
    <UniqueStopListContext.Provider value={uniqueStopList}>
    <BusStopsLoadingContext.Provider value={busLoading}>
      {children}
      </BusStopsLoadingContext.Provider>
    </UniqueStopListContext.Provider>
    </BusStopsContext.Provider>
  )
}
