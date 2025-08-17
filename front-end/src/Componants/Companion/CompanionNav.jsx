
import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import CompanionShareLocation from "../Companion/CompanionShareLocation"; // Import location sharing

function CompanionNav() {
  const compId = localStorage.getItem("complogId");
  const [companion, setCompanion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleLogout = () => {
    localStorage.removeItem("complogId"); // Remove login ID
    localStorage.removeItem("com_obj_id"); // Remove companion object ID if stored
  
    // Redirect to login page
    window.location.href = "/"; 
  };
  
  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/companion/home/${compId}`);
        
        console.log(response);
        localStorage.setItem('com_obj_id',response.data._id)
        setCompanion(response.data);
        
      } catch (err) {
        setError("Error fetching companion data");
      } finally {
        setLoading(false);
      }
    };

    if (compId) {
      fetchCompanion();
    }
  }, [compId]);

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#">
            {companion ? companion.name : "Companion"}!
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              
              <Nav.Link as={Link} to="/requests" className="text-white">Patients Request</Nav.Link>
              <Nav.Link as={Link} to="/patients" className="text-white">My Patients</Nav.Link>
              
              <Button variant="outline-light" className="ms-2" onClick={handleLogout}>
  Logout
</Button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Call CompanionShareLocation here */}
      {compId && <CompanionShareLocation companionId={companion?companion._id:'00'} />}
    </div>
  );
}

export default CompanionNav;
