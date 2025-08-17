import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Alert, Form, Spinner, Row, Col, Modal } from "react-bootstrap";
import CompanionNav from "./CompanionNav";
import CompanionMap from "../Companion/CompanionMap"; // Import the CompanionMap component

function RequestsUser() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedBookingId, setSelectedBookingId] = useState(null); // State for view location

    useEffect(() => {
        const fetchRequests = async () => {
          const storedCompId = localStorage.getItem("com_obj_id");
          console.log('Stored Companion ID:', storedCompId);
          
          if (!storedCompId) return;
      
          try {
            const response = await axios.get(`http://localhost:8000/api/companion-booking/companion/${storedCompId}`);
            console.log(response);
            
            setRequests(response.data.bookings);
            setFilteredRequests(response.data.bookings);
          } catch (err) {
            setError("Error fetching requests");
          } finally {
            setLoading(false);
          }
        };
      
        fetchRequests();
      }, []); // Run only once when the component mounts
      
    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/api/companion-booking/update-status/${bookingId}`, { status: newStatus });

            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request._id === bookingId ? { ...request, status: newStatus } : request
                )
            );

            setFilteredRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request._id === bookingId ? { ...request, status: newStatus } : request
                )
            );
        } catch (err) {
            setError("Error updating request status");
        }
    };

    const handleDateFilter = (e) => {
        const selected = e.target.value;
        setSelectedDate(selected);

        if (!selected) {
            setFilteredRequests(requests);
            return;
        }

        const filtered = requests.filter((req) => new Date(req.date).toISOString().split("T")[0] === selected);
        setFilteredRequests(filtered);
    };

    return (
        <div>
            <CompanionNav />
            <Container>
                <h2 className="my-4 text-center">📋 User Requests</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Date Filter */}
                <Row className="mb-3 justify-content-center">
                    <Col md={4}>
                        <Form.Group controlId="filterDate">
                            <Form.Label className="fw-bold">Filter by Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={handleDateFilter}
                                className="shadow-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Loading Spinner */}
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading requests...</p>
                    </div>
                )}

                {/* Requests List */}
                {!loading && (
                    <Row>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.slice().reverse().map((request) => {
                                const requestDate = new Date(request.date).toISOString().split("T")[0];

                                return (
                                    <Col md={6} key={request._id}>
                                        <Card className="mb-4 shadow-lg border-0 rounded">
                                            <Card.Body>
                                                <Card.Title className="fw-bold text-primary">{request.patientName}</Card.Title>
                                                <Card.Text><strong>👤 Age:</strong> {request.age}</Card.Text>
                                                <Card.Text><strong>📝 Description:</strong> {request.description}</Card.Text>
                                                <Card.Text><strong>📅 Date:</strong> {requestDate}</Card.Text>
                                                <Card.Text><strong>📍 Address:</strong> {request.address}</Card.Text>
                                                <Card.Text><strong>📞 Phone:</strong> {request.phone}</Card.Text>
                                                <Card.Text>
                                                    <strong>🔖 Status:</strong> <span className={`badge ${request.status === "pending" ? "bg-warning" : request.status === "confirmed" ? "bg-success" : "bg-danger"}`}>
                                                        {request.status.toUpperCase()}
                                                    </span>
                                                </Card.Text>

                                                {/* Accept & Reject Buttons */}
                                                {request.status === "pending" && (
                                                    <div className="d-flex gap-2">
                                                        <Button variant="success" onClick={() => handleUpdateStatus(request._id, "confirmed")}>
                                                            ✅ Accept
                                                        </Button>
                                                        <Button variant="danger" onClick={() => handleUpdateStatus(request._id, "rejected")}>
                                                            ❌ Reject
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* View Location Button */}
                                                {request.status === "pickedup" && (
                                                    <Button
                                                        variant="info"
                                                        className="mt-2"
                                                        onClick={() => setSelectedBookingId(request._id)}
                                                    >
                                                        View Location
                                                    </Button>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })
                        ) : (
                            <Col className="text-center">
                                <p className="text-muted">No requests found.</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>

            {/* Companion Location Modal */}
            <Modal show={!!selectedBookingId} onHide={() => setSelectedBookingId(null)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Companion Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBookingId && <CompanionMap bookingId={selectedBookingId} />}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default RequestsUser;
