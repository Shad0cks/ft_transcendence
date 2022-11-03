import React from 'react';
import '../../css/Pages/Header.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

export default function Header({ username }: { username: string | undefined }) {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar bg="dark" variant="dark" fixed="top" style={{fontFamily: 'Orbitron'}}>
        <Container>
          <Navbar.Brand style={{cursor: "pointer"}} onClick={() => navigate('/', { state :{alreadyUsername: username, alreadyLog: true}})}>FT_TRANSCENDENCE</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="responsive-navbar-nav justify-content-end">
            <Nav className="justify-content-end">
              <NavDropdown title={username} id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Game History
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Friends
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Profile Edit
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
