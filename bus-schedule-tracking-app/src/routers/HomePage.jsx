import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Stack from "react-bootstrap/Stack";

/**Additional application components can be added as a Button Link*/
export function HomePage(){
  return(
    <>
    <h1 className="text-center mb-3">Welcome to Bus Info</h1>
    <Stack gap={3} className="col-md-5 mx-auto">
      <Button as={Link} to="/bus-arrival">Bus arrival</Button>
      <Button as={Link} to="/bus-tracking">Track my bus route</Button>
      <Button as={Link} to="/bus-stops-map">Bus Stops Map</Button>
    </Stack>
  </>
  )
}