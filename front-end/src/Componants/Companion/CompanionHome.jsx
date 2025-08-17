import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import CompanionNav from "./CompanionNav";
import RequestsUser from "./Requestsuser";

function CompanionHome() {
  const compId = localStorage.getItem("complogId");
  const [companion, setCompanion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/companion/home/${compId}`);
        console.log(response);
        
        setCompanion(response.data);
        localStorage.setItem('com_obj_id',response.data._id)
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
console.log('lll',companion);

  return (
    <div>
<CompanionNav/>
      {/* Main Content */}
      <Container>
      <RequestsUser  id={companion}/>
      </Container>
    </div>
  );
}

export default CompanionHome;
