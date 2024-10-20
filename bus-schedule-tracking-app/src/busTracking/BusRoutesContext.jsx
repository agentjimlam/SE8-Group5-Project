import { createContext } from "react";
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { busApi, BUS_ROUTES } from "../busInfo/apiUtils";

export const BusRoutesContext = createContext(null);
export const BusRoutesLoadingContext = createContext(null);
// PropTypes.element: A React element (ie. <MyComponent />).
BusRoutesContextProvider.propTypes = {
  children: PropTypes.element,
}
export function BusRoutesContextProvider({children}){
  const [busRoutes, setBusRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);

  // Fetch the bus routes. No dependency.
  useEffect(()=>{
    let ignore = false;
    async function fetchBusRoutes(){
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
          setRoutesLoading(true);
          const response = await busApi.get(BUS_ROUTES, {params});
          dataLen = response.data.value.length; // if 500 continue
          // Push individual items of the response data into the list.
          // Cannot push response.data as an [], like tempList.push(
          // response.data). Because this will push the array [response.
          // data] into the tempList. The tempList becomes [[data-1],
          // [data-2], ... [data-n]].
          tempList.push(...response.data.value); 
          //console.log("Bus routes len ", tempList.length);
          // next 500 records
          i = i + 500;
        } catch(error){
          console.error(error);
        }
        finally{
          setRoutesLoading(false);
        }
      } while(dataLen === 500);
      // set the bus services list to this temp list
      if(!ignore){setBusRoutes(tempList);}
    }
    // call fetch data
    fetchBusRoutes();
    // clean up the connection
    return (()=>{ignore = true;})
  }, [])


  return(
    <BusRoutesContext.Provider value={busRoutes}>
    <BusRoutesLoadingContext.Provider value={routesLoading}>
      {children}
    </BusRoutesLoadingContext.Provider>
    </BusRoutesContext.Provider>
  )
}