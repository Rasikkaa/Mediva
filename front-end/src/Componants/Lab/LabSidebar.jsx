
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaUserMd, FaSignOutAlt, FaHome, FaVial } from 'react-icons/fa';

const LabNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('lablogId');
    localStorage.removeItem('userObjId');
    navigate('/', { replace: true });
  };

  return (
    <Navbar bg="primary" variant="dark" expand="md" className="shadow">
      <Container>
        {/* Logo & Title */}
        <Navbar.Brand as={Link} to="/labhome" className="d-flex align-items-center">
          <FaVial className="me-2" /> Lab Dashboard
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="lab-navbar-nav" />

        <Navbar.Collapse id="lab-navbar-nav">
          {/* Navigation Links */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/labhome" className="d-flex align-items-center text-white">
              <FaHome className="me-1" /> 
            </Nav.Link>
            <Nav.Link as={Link} to="/checkup" className="d-flex align-items-center text-white">
              <FaUserMd className="me-1" /> Test
            </Nav.Link>
          </Nav>

          {/* Logout Button */}
          <Button variant="danger" className="ms-3 d-flex align-items-center" onClick={handleLogout}>
            <FaSignOutAlt className="me-1" /> Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LabNavbar;
