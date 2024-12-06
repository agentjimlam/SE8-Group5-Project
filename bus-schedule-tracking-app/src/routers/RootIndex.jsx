import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from '../store/auth-context';
import Button from 'react-bootstrap/esm/Button';

// RootIndex() is same as RootLayout.jsx we learnt in practice exercise for module 2.7-2.8
// Navbar.jsx component codes we learn in class is also put here
// RootIndex is called in App.jsx, from RouterMap.jsx, as createBrowserRouter method was used instead
// Persistent layout for the whole app
export function RootIndex() {

  const userCtx = useContext(AuthContext);
  const { isLoggedIn, logoutHandler } = userCtx;


  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/home">Bus Info</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <NavDropdown title="Bus Info" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/bus-main">
                Bus Arrival
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/bus-tracking">
                Bus Tracking
              </NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/bus-stops-map">
                Bus Stops Map
              </NavDropdown.Item> */}
              <NavDropdown.Item as={Link} to="/map-main">
                Bus Tracking Map
              </NavDropdown.Item>
            </NavDropdown>

            {/* Show Login if user is not logged in */}
            {!isLoggedIn && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}

            {/* Show Logout if user is logged in */}
            {isLoggedIn && (
              <Button onClick={logoutHandler}>
                Log Out
              </Button>
            )}


          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
    <Container>
      {/* where all the child routes components are rendered */}
      <Outlet />
    </Container>
    </>
  );
}

