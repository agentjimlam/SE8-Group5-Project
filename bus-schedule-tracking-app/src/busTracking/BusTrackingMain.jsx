/**
 * Main of the bus route tracking functionality.
 */
import { BusStopsContextProvider } from "./BusStopsContext";
import { BusServicesContextProvider} from "./BusServicesContext";
import { BusRoutesContextProvider } from "./BusRoutesContext";
import { BusRoutesTest } from "./BusRoutesTest";
import { BusRoutesWithDistances } from "./BusRoutesWithDistances";

export function BusTrackingMain(){
 
  return(
    <>
    <BusStopsContextProvider>
    <BusServicesContextProvider>
    <BusRoutesContextProvider>
       <BusRoutesTest />
       <BusRoutesWithDistances />
    </BusRoutesContextProvider>
    </BusServicesContextProvider>
    </BusStopsContextProvider>
    </>
  )


}