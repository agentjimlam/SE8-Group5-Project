import { createBrowserRouter } from "react-router-dom";

// Application components
import { RootIndex } from "./RootIndex";
import { ErrorPage } from "./ErrorPage";
import { HomePage } from "./HomePage";
import { BusMain } from "../components/BusMain";
import { BusTrackingMain } from "../busTracking/BusTrackingMain";
import LocationMarker from "../components/LocationMarker";


/**Add a new component by just adding {path, element} to the children. */
export const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootIndex />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <HomePage/>,
      },
      {
        path: "bus-main",
        element: <BusMain />,
      },
      {
        path: "bus-tracking",
        element: <BusTrackingMain />,
      },
      {
        path: "bus-stops-map",
        element: <LocationMarker/>
      },
    ]
  }
])


