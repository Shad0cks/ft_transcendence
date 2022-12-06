import React from 'react';
import '../css/Components/Header.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { UserLogout } from '../services/User/userDelog';

export default function Header({
  username,
  iconUser,
}: {
  username: string | undefined;
  iconUser: string | undefined;
}) {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        fixed="top"
        style={{ fontFamily: 'Orbitron', zIndex: 1 }}
      >
        <Container>
          <Navbar.Brand
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            FT_TRANSCENDENCE
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="responsive-navbar-nav justify-content-end">
            <Nav className="justify-content-end">
              <NavDropdown
                title={
                  <Image
                    style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                    src={iconUser}
                    roundedCircle
                    alt={username}
                  />
                }
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item onClick={() => navigate('/editProfile')}>
                  Profile Edit
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/friends')}>
                  Friends
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/search')}>
                  Search a user
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={async () => {
                    await UserLogout();
                    navigate('/');
                    window.location.reload();
                  }}
                >
                  {' '}
                  Log Out{' '}
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
