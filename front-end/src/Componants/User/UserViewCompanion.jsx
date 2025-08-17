
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import BookingModal from "./BookingModal";

function UserViewCompanion() {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/companion/allcompanion");
        setCompanions(response.data);
      } catch (err) {
        setError("Failed to load companions");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanions();
  }, []);

  return (
    <div className="d-flex">
      <UserSidebar />

      <Container className="mt-4" style={{ marginLeft: "280px", padding: "20px", width: "75%" }}>
        
          <h2 style={{textAlign:'center'}}> Companions</h2>
        

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row>
            {companions.length > 0 ? (
              companions.map((companion) => (
                <Col md={4} key={companion._id}>
                  <Card className="shadow-sm mb-3">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8000/${companion.image}`}
                      alt={companion.name}
                      style={{height: "200px", objectFit: "scale-down"}} 
                    />
                    <Card.Body>
                      <Card.Title>{companion.name}</Card.Title>
                      <Card.Text>Experience: {companion.experience} Years</Card.Text>
                      <Card.Text>Phone: {companion.phone}</Card.Text>
                      <Button variant="primary" onClick={() => setSelectedCompanion(companion)}>
                        Book Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center">No companions available.</p>
            )}
          </Row>
        )}
      </Container>

      {selectedCompanion && <BookingModal companion={selectedCompanion} onHide={() => setSelectedCompanion(null)} />}
    </div>
  );
}

export default UserViewCompanion;
