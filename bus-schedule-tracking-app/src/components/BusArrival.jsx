import { useEffect, useState, useContext, useMemo } from "react";
import { busApi, BUS_ARRIVAL } from "./apiUtils";
import { BusRoutesContext, BusServicesContext, BusStopsContext, 
  UniqueBusServicesContext, 
  UniqueStopListContext} from "./BusContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export function BusArrival(){
  const busStops = useContext(BusStopsContext);
  const uniqueStopList = useContext(UniqueStopListContext);
  const busServices = useContext(BusServicesContext);
  const uniqueServiceNo = useContext(UniqueBusServicesContext);
  const busRoutes = useContext(BusRoutesContext);
  const [busArrival, setBusArrival] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [busStopCodeInput, setBusStopCodeInput] = useState("");
  const [busServiceNoInput, setBusServiceNoInput] = useState("");
  const [busStopCodeErrorMessage, setBusStopCodeErrorMessage] = useState("");
  const [busServiceErrorMessage, setBusServiceErrorMessage] = useState("");
  /*
  useEffect(()=>{
    let ignore = false;
    // load data
    // fetch the data
    getData();
    // clean up
    return (()=>{ignore=true})
  }, [busStopCodeInput])
  */

  // Get estimated arrival time.
  /**
   * JS stores dates as time in ms since midnight January 1, 1970 
   * So calculating the time between two dates is as simple as subtracting 
   * them.
   * Create a Date() object at two different times.
   *  var time1 = new Date(); var time2 = new Date();
   *  var difference = time2-time1; 
   *  These are the milliseconds. Do /1000 for seconds, 
   *  then /60 for minutes, then /60 for hours and then /24 for
   *  the final difference in days.
   */
  function calculateEstimatedArrivalTime(estArrivalTime){
    const est = new Date(estArrivalTime).getTime();
    const now =  new Date().getTime();
    let delta = Math.abs(est - now);
    // Round to the nearset minute
    delta = Math.round(delta/1000/60);
    return delta;
  }
  // Fetch the data
  async function getData(){
    // Check the bus service no is in the list of 
    // bus services at the bus stop.
    // bus stop code is mandatory.
    let params;
    if((busStopCodeInput!=="") && 
      uniqueStopList.includes(busStopCodeInput)){
      params = {BusStopCode: busStopCodeInput};
    } else {
      setBusStopCodeErrorMessage("Input a valid bus stop code.");
      return;
    }
    if((busServiceNoInput!=="") && (
      listOfServiceNo.includes(busServiceNoInput)
    )){
      params = {...params, ServiceNo: busServiceNoInput};
    } 
    // The checking of the bus service no is not working.
    // if ((listOfServiceNo.length>0) && 
    //   (!listOfServiceNo.includes(busServiceNoInput))){
    //   setBusServiceErrorMessage("Input a valid bus service number \
    //     for this bus stop.")
    //   return;
    // }
    try{
      setIsLoading(true);
      const response = await busApi.get(BUS_ARRIVAL,  
        {params});
      setBusArrival(response.data);
    }catch(error){
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  }

  // get the bus service number for a given
  // bus stop code.
  const listOfServiceNo = useMemo(()=>{
    function getBusServiceNoOfBusStopCode(){
      // is bus stop code is not valid, return []
      if(uniqueStopList.includes[busStopCodeInput]===false){
        return [];
      }
      // filter the list to get the service 
      // available at this bus stop code 
      const tempList = busRoutes.filter((i)=>(
        (i["BusStopCode"]===busStopCodeInput) 
      ));
      // now, get only unique values from the list of services.
      const uniqueList = [];
      for(const i of tempList){
        if(uniqueList.includes[i["ServiceNo"]]){
          continue; // skip the repeated service number
        }
        else {
          uniqueList.push(i["ServiceNo"]);
        }
      }
      return uniqueList;
    }
    // call the function to get a list of bus service number
    // according to the bus stops
    return getBusServiceNoOfBusStopCode();
}, [uniqueStopList, busRoutes, busStopCodeInput])

  // Get the bus stop name and description
  const {roadName, stopDesc} = useMemo(()=>{
    let currentStop;
    function getStopInfo(){
      let info;
      currentStop = busStops.find((i)=>(
        i.BusStopCode === busStopCodeInput
      ));
      if(currentStop){
        info = {roadName: currentStop.RoadName,
            stopDesc: currentStop.Description,}
      } else {
        info = {roadName: "", stopDesc: ""}
      }
      return info;
  }
  return getStopInfo();
  }, [busStops, busStopCodeInput])

  // Event handler
  // Input to bus stop code
  function handleBusStopCodeInput(e){
    const newInput = e.target.value;

    setBusStopCodeInput(newInput);
    // When bus stop code is changed,
    // clear the service number.
    setBusServiceNoInput("");
    // check the error message
    if(uniqueStopList.includes(newInput)===false) {
      setBusStopCodeErrorMessage("Input a valid bus stop code.")
    } else {
      // clear the error message
      setBusStopCodeErrorMessage("");
    }
  }
  function handleBusServiceNoInput(e){
    const newInput = e.target.value;
    // Check if the bus service for the bus stop code
    // is valid.
    // if the service no is valid, set the state.
    setBusServiceNoInput(newInput);
    if(listOfServiceNo.length > 0 && listOfServiceNo.includes(newInput)) {
        // reset the error message
        setBusServiceErrorMessage("");
    } else {
      setBusServiceErrorMessage("Input a valid bus service number.");
    }
  }
  // Handle the search button
  function handleSearchBusStopCode(e){
    // Call the get data to fetch the input.
    getData();
  }

  // Display the form content
  let content;
  if((busServices.length>0 && busStops.length>0))
  {
    content = (
      <>
      <form>
        <label htmlFor="busStopCodeInput"
        >Bus stop code <span style={{color:"red"}}>*</span>
        </label>
        <input
          id="busStopCodeInput"
          name="busStopCodeInput"
          type="search"
          required
          list="listOfBusStopCodes"
          placeholder="83139"
          value={busStopCodeInput}
          onChange={handleBusStopCodeInput}
        ></input>
        <datalist id="listOfBusStopCodes">
          {
            uniqueStopList.map((i)=>(
              <option key={i} value={i}></option>
            ))
          }
        </datalist>
        <small>{busStopCodeErrorMessage}</small>
        <p>Road name: {roadName}</p>
        <p>Bus stop: {stopDesc}</p>
        <p>Bus service number
        {((listOfServiceNo.length > 0)&&(
          listOfServiceNo.map((i)=>(
            <span key={i}>{i}, </span>
          ))
        ))}</p>


        <label htmlFor="busServiceNoInput">
        Service number</label>
        <input
          id="busServiceNoInput"
          name="busServiceNoInput"
          type="search"
          list="listOfBusServiceNo"
          placeholder="Optional"
          value={busServiceNoInput}
          onChange={handleBusServiceNoInput}
        ></input>
        <datalist id="listOfBusServiceNo">
          {
            listOfServiceNo.map((i)=>(
              <option key={i} value={i}></option>
            ))
          }
        </datalist>
        <small>{busServiceErrorMessage}</small>
      </form>

      <button
        type="button"
        name="btnSearchBusStopCode"
        onClick={handleSearchBusStopCode}
      >Search</button>
      </>
    )} else {
    content = (<p>Loading page ....</p>)
  }

  // Display the results
  let resultContent;
  if(!isLoading && busArrival){
    resultContent = (
      busArrival["Services"].map((i)=>(
        <ul key={i.ServiceNo} variant="flush">
          <h3>Service No. {i.ServiceNo}</h3>
          {i.NextBus && (
            <li>
              Estimated {calculateEstimatedArrivalTime(i.NextBus.EstimatedArrival)} min<br/>
              {(i.NextBus.Monitored===0) && (<>Based on schedule</>)}
              {(i.NextBus.Monitored===1) && (<>Based on bus location</>)}
              {(i.NextBus.Feature==="WAB") && (<p>Wheelchair assessible</p>)}
              {(i.NextBus.Feature==="") && (<p>Not wheelchair assessible</p>)}
            </li>
          )}
          {i.NextBus2 && (
            <li>
              Estimated {calculateEstimatedArrivalTime(i.NextBus2.EstimatedArrival)} min<br/>
              {(i.NextBus2.Monitored===0) && (<>Based on schedule</>)}
              {(i.NextBus2.Monitored===1) && (<>Based on bus location</>)}
              {(i.NextBus2.Feature==="WAB") && (<p>Wheelchair assessible</p>)}
              {(i.NextBus2.Feature==="") && (<p>Not wheelchair assessible</p>)}
            </li>
          )}
          {i.NextBus3 && (
            <li>
              Estimated {calculateEstimatedArrivalTime(i.NextBus3.EstimatedArrival)} min<br/>
              {(i.NextBus3.Monitored===0) && (<>Based on schedule</>)}
              {(i.NextBus3.Monitored===1) && (<>Based on bus location</>)}
              {(i.NextBus3.Feature==="WAB") && (<p>Wheelchair assessible</p>)}
              {(i.NextBus3.Feature==="") && (<p>Not wheelchair assessible</p>)}
            </li>
          )}
        </ul>
      )))}
  else {
    resultContent = (<p>Results</p>)
  }

  return(
    <>
    <h2>Bus arrival</h2>

    {content}
    {resultContent}
    </>
  )
}