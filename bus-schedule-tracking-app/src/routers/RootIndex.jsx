import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, Outlet } from "react-router-dom";

export function RootIndex() {
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
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
    <Container>
      <Outlet />
    </Container>
    </>
  );
}

