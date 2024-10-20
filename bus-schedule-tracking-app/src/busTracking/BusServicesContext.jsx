import { createContext } from "react";
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { busApi, BUS_SERVICES } from "../busInfo/apiUtils";

export const BusServicesContext = createContext(null);
export const UniqueBusServicesContext = createContext(null);
export const BusServicesLoadingContext = createContext(null);

// PropTypes.element: A React element (ie. <MyComponent />).
BusServicesContextProvider.propTypes = {
  children: PropTypes.element,
}
export function BusServicesContextProvider({children}){

  const [busServices, setBusServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Fetch the list of bus services. No dependency
  useEffect(()=>{
    let ignore = false;
    async function fetchBusServices(){
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
          setServicesLoading(true);
          const response = await busApi.get(BUS_SERVICES, {params});
          dataLen = response.data.value.length; // if 500 continue
          // MUST NOT use [], push individual items.
          tempList.push(...response.data.value); 
          //console.log("Bus services len ", tempList.length);
          // next 500 records
          i = i + 500;
        } catch(error){
          console.error(error);
        }
        finally{
          setServicesLoading(false);
        }
      } while(dataLen === 500);
      // set the bus services list to this temp list
      setBusServices(tempList);
    }
    // call fetch data
    fetchBusServices();
    // clean up the connection
    return (()=>{ignore = true;})
  }, [])
  // A list of unique bus service no
  // use memo for the unique service no
  const uniqueServiceNo = useMemo(()=>{
    // Get unique service no.
    function getUniqueServiceNo(){
      const newList = [];
      if(!servicesLoading && (busServices.length>0)){
        // Get the unique bus stops
        for(let i=0; i<busServices.length; i++){
          if(newList.includes(busServices[i]["ServiceNo"])){
            continue; // skip
          }
          else{
            // save the new found service number
            newList.push(busServices[i]["ServiceNo"]); 
          }
        }
      }
      return newList;
    }
      // MUST return the list from the function call
      return getUniqueServiceNo();
    }, [busServices, servicesLoading])  
  
  return(
    <BusServicesContext.Provider value={busServices}>
    <UniqueBusServicesContext.Provider value={uniqueServiceNo}>
    <BusServicesLoadingContext.Provider value={servicesLoading}>
      {children}
      </BusServicesLoadingContext.Provider>
    </UniqueBusServicesContext.Provider>
    </BusServicesContext.Provider>
  )
}