import { useState, useEffect, useMemo, useContext } from "react";
import {
  BusServicesContext,
  BusRoutesContext,
  BusStopsContext,
  UniqueBusServicesContext,
  UniqueStopListContext,
} from "./BusContext";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import Table from "react-bootstrap/Table";

import styles from "./BusRoutes.module.css";

export function BusRoutes() {
  //const [busRoutes, setBusRoutes] = useState([]);
  //const [busServices, setBusServices] = useState([]);
  const busRoutes = useContext(BusRoutesContext);
  const busServices = useContext(BusServicesContext);
  const busStops = useContext(BusStopsContext);
  const uniqueBusServices = useContext(UniqueBusServicesContext);
  const uniqueStopList = useContext(UniqueStopListContext);
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [serviceNoInput, setServiceNoInput] = useState(""); // bus service no
  // direction of bus route, default to 1.
  const [serviceDirectionInput, setServiceDirectionInput] = useState(1);
  // The route info
  const [direction1, setDirection1] = useState({
    origin1: "",
    dest1: "",
    loopDesc: "",
  });
  const [direction2, setDirection2] = useState({ origin2: "", dest2: "" });
  const [route1, setRoute1] = useState([]);
  const [route2, setRoute2] = useState([]);

  // get the road name of a bus stop
  function getRoadName(busStopCode) {
    let roadName;
    const tempItem = busStops.find((i) => i["BusStopCode"] === busStopCode);

    if (tempItem) {
      roadName = tempItem["RoadName"];
    } else {
      roadName = "";
    }
    return roadName;
  }
  // get the description of a bus stop
  function getRoadDescription(busStopCode) {
    let desc;
    const tempItem = busStops.find((i) => i["BusStopCode"] === busStopCode);
    if (tempItem) {
      desc = tempItem["Description"];
    } else {
      desc = "";
    }
    return desc;
  }

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

  // Get a list of routes according to the bus service no.
  /**
   *  From BusRoutes
   *  "ServiceNo": "10",
   *  "Operator": "SBST",
   *  "Direction": 1,
   *  "StopSequence": 1,
   *  "BusStopCode": "75009",
   *  "Distance": 0,
   *
   *  From BusServices
   *  "ServiceNo": "118",
   *  "Operator": "GAS",
   *  "Direction": 1,
   *  "Category": "TRUNK",
   *  "OriginCode": "65009",
   *  "DestinationCode": "97009",
   */
  // Assemble the route sequence
  function assembleRoutes() {
    const route1 = [];
    const route2 = [];
    // This will check for loop service.
    let isLoopService = false;
    // Is there any bus service input
    if (serviceNoInput === "") {
      return { route1: [], route2: [] };
    }
    // Find the bus service number from the unique
    // bus service list.
    // Get the OriginCode && StopSequence = first stop
    // Get the DestinationCode && StopSequence = last stop
    // Sequence the route one by one.
    let tempList1, tempList2;
    // Direction 1
    tempList1 = busRoutes.filter(
      (i) => i["ServiceNo"] === serviceNoInput && i["Direction"] === 1
    );
    console.log("temp list 1 ", tempList1);
    console.log("len of temp list 1 ", tempList1.length);
    // use the origin1 and dest1 for the BusStopCode.
    // Then get the corresponding sequence number.
    let tempItem;
    // get the origin and dest
    // Need to take care of the loop situation where
    // the bus stop code or origin===dest.
    const { origin1, dest1, loopDesc, origin2, dest2 } = getOriginDestInfo();
    // Check for looping service by comparing origin===dest.
    // If it is a loop service, there is no Direction 2.
    if (origin1 === dest1) {
      isLoopService = true;
    }
    // Find the origin1
    tempItem = tempList1.find((i) => i["BusStopCode"] === origin1);
    console.log("start sequence ", tempItem["StopSequence"]);
    let start1 = tempItem["StopSequence"];
    // Find dest1. Find lst index to take care of
    // the looping service.
    tempItem = tempList1.findLast((i) => i["BusStopCode"] === dest1);
    console.log("end sequence ", tempItem["StopSequence"]);
    let end1 = tempItem["StopSequence"];
    // Now use the sequence start and stop to get the list of
    // bus stops of the route.
    // The "StopSequence" is not always in sequence, so skip
    // those that are not available.
    for (let num = start1; num <= end1; num++) {
      tempItem = tempList1.find((i) => {
        return i["StopSequence"] === num;
      });
      // sometimes sequence number is skipped.
      console.log("In loop , item ", tempItem);
      if (!tempItem) {
        continue;
      } else {
        route1.push(tempItem["BusStopCode"]);
      }
    }

    // Direction 2
    tempList2 = busRoutes.filter(
      (i) => i["ServiceNo"] === serviceNoInput && i["Direction"] === 2
    );
    // if no direction 2, return [].
    // route2 is initialized as [].
    console.log("temp list 2", tempList2);
    if (isLoopService === true || tempList2.length === 0) {
      return { route1: route1, route2: route2 };
    }
    // use the origin1 and dest1 for the BusStopCode.
    // Then get the corresponding sequence number.
    // get the origin and dest
    tempItem = tempList2.find((i) => i["BusStopCode"].toString() === origin2);
    let start2 = tempItem["StopSequence"];
    tempItem = tempList2.find((i) => i["BusStopCode"] === dest2);
    let end2 = tempItem["StopSequence"];
    // Now use the sequence start and stop to get the list of
    // bus stops of the route.
    // The "StopSequence" is not always in sequence, so skip
    // those that are not available.
    for (let num = start2; num <= end2; num++) {
      tempItem = tempList2.find((i) => i["StopSequence"] === num);
      if (!tempItem) {
        continue;
      } else {
        route2.push(tempItem["BusStopCode"]);
      }
    }
    // return the routes
    return { route1: route1, route2: route2 };
  }

  // Get origin, dest and loop info
  function getOriginDestInfo() {
    let tempItem1, tempItem2;
    let info = { origin1: "", dest1: "", loopDesc: "", origin2: "", dest2: "" };
    // Check for input
    if (serviceNoInput === "") {
      return info;
    }
    tempItem1 = busServices.find(
      (i) => i.ServiceNo === serviceNoInput && i.Direction === 1
    );
    // Direction 1 is always available.
    // Loop service only have direction 1.
    // Loop service will have LoopDesc.
    if (tempItem1) {
      info = {
        origin1: tempItem1["OriginCode"],
        dest1: tempItem1["DestinationCode"],
        loopDesc: tempItem1["LoopDesc"],
      };
    }
    // check for direction 2
    tempItem2 = busServices.find(
      (i) => i.ServiceNo === serviceNoInput && i.Direction === 2
    );
    if (tempItem2) {
      info = {
        ...info,
        origin2: tempItem2["OriginCode"],
        dest2: tempItem2["DestinationCode"],
      };
    }
    // return the info
    return info;
  }

  // event handler
  function handleServiceNoInput(e) {
    const newInput = e.target.value;
    setServiceNoInput(newInput);
    // clear the routes
    setRoute1([]);
    setRoute2([]);
    setDirection1({ origin1: "", dest1: "", loopDesc: "" });
    setDirection2({ origin2: "", dest2: "" });
  }
  function handleDirectionInput(e) {
    const newInput = e.target.value;
    console.log("Target value ", newInput);
    setServiceDirectionInput(newInput);
    // clear the routes
    setRoute1([]);
    setRoute2([]);
  }
  // search the route
  function handleSearchRoute(e) {
    // Get the origin and destination bus stop code
    const { origin1, dest1, loopDesc, origin2, dest2 } = getOriginDestInfo();
    setDirection1({ origin1: origin1, dest1: dest1, loopDesc: loopDesc });
    setDirection2({ origin2: origin2, dest2: dest2 });
    // Call the function
    const { route1, route2 } = assembleRoutes();
    setRoute1(route1);
    setRoute2(route2);
  }

  // List the direction
  let directionResult;
  if (serviceDirectionInput === "1") {
    directionResult = route1.map((busStopCode, index) => (
      <tr key={`${index}-${busStopCode}`}>
        <td>
          <ul>
            <li>Bus stop: {busStopCode ? busStopCode : ""}</li>
            <li>Place: {busStopCode ? getRoadDescription(busStopCode) : ""}</li>
            <li>Road: {busStopCode ? getRoadName(busStopCode) : ""}</li>
          </ul>
        </td>
      </tr>
    ));
  }
  if (serviceDirectionInput === "2") {
    directionResult = route2.map((busStopCode, index) => (
      <tr key={`${index}-${busStopCode}`}>
        <td>
          <ul>
            <li>Bus stop: {busStopCode ? busStopCode : ""}</li>
            <li>Place: {busStopCode ? getRoadDescription(busStopCode) : ""}</li>
            <li>Road: {busStopCode ? getRoadName(busStopCode) : ""}</li>
          </ul>
        </td>
      </tr>
    ));
  }

  // List the bus routes
  let content;
  if (isLoading) {
    content = <p>Loading data ...</p>;
  }
  if (!isLoading && busRoutes.length > 0 && busServices.length > 0) {
    content = (
      <>
        <form>
          <label>Service</label>
          <input
            type="search"
            name="serviceNoInput"
            value={serviceNoInput}
            list="listOfUniqueServiceNo"
            onChange={handleServiceNoInput}
          ></input>
          <datalist id="listOfUniqueServiceNo">
            {uniqueServiceNo.map((i) => (
              <option key={i} value={i}></option>
            ))}
          </datalist>

          <div>
            <input
              id="radioDirection1"
              name="radioDirection"
              type="radio"
              label="Direction 1"
              value="1"
              checked={serviceDirectionInput === "1"}
              onChange={handleDirectionInput}
            ></input>
            <label htmlFor="radioDirection1">Direction 1</label>
          </div>
          <div>
            <input
              id="radioDirection2"
              name="radioDirection"
              type="radio"
              value="2"
              checked={serviceDirectionInput === "2"}
              onChange={handleDirectionInput}
            ></input>
            <label htmlFor="radioDirection2">Direction 2</label>
          </div>
          <button
            type="button"
            name="btnSearchRoute"
            onClick={handleSearchRoute}
          >
            Search
          </button>
        </form>
        <h3>Routes of service {serviceNoInput}</h3>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                {serviceDirectionInput === "1" && (
                  <th className={styles.th}>
                    Direction 1
                    <ul>
                      <li>Origin bus stop: {direction1.origin1}</li>
                      <ul>
                        <li>Place: {getRoadDescription(direction1.origin1)}</li>
                        <li>Road: {getRoadName(direction1.origin1)}</li>
                      </ul>

                      <li>Destination bus stop: {direction1.dest1}</li>
                      <ul>
                        <li>{getRoadDescription(direction1.dest1)}</li>
                        <li>{getRoadName(direction1.dest1)}</li>
                      </ul>
                    </ul>
                    {direction1.loopDesc ? (
                      <>Loop at: {direction1.loopDesc}</>
                    ) : (
                      ""
                    )}
                  </th>
                )}

                {serviceDirectionInput === "2" && (
                  <th>
                    Direction 2
                    <ul>
                      <li>Origin bus stop: {direction2.origin2}</li>
                      <ul>
                        <li>Place: {getRoadDescription(direction2.origin2)}</li>
                        <li>Road: {getRoadName(direction2.origin2)}</li>
                      </ul>

                      <li>Destination bus stop: {direction2.dest2}</li>
                      <ul>
                        <li>{getRoadDescription(direction2.dest2)}</li>
                        <li>{getRoadName(direction2.dest2)}</li>
                      </ul>
                    </ul>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>{directionResult}</tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Bus routes</h1>
      {content}
    </>
  );
}
