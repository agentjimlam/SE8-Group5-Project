import { createBrowserRouter } from "react-router-dom";

// Application components
import { RootIndex } from "./RootIndex";
import { ErrorPage } from "./ErrorPage";
import { HomePage } from "./HomePage";
import { BusMain } from "../components/BusMain";
import { BusTrackingMain } from "../busTracking/BusTrackingMain";
// import Map from "../components/Map";
import MapMain from "../components/MapMain";
import LoginPage from "./LoginPage";


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
      // {
      //   path: "bus-stops-map",
      //   element: <Map />, /*replaced with Map component as LocationMarker does not display the map, it displays just user's location marker */
      // },
      {
        path: "map-main",
        element: <MapMain />,
      },
      {
        path: "login",
        element: <LoginPage />
      }
    ]
  }
])


