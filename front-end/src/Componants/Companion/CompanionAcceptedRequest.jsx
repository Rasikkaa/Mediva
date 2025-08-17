import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Alert,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
  Badge,
} from "react-bootstrap";
import CompanionNav from "./CompanionNav";
import CompanionMap from "../Companion/CompanionMap"; // Import the map component

function CompanionAcceptedRequest() {
  const compId = localStorage.getItem("com_obj_id");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentLinks, setPaymentLinks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null); // For view location

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/companion-booking/companion/${compId}`
      );
      let acceptedRequests = response.data.bookings.filter(
        (req) => req.status !== "rejected"
      );

      // Sort in Last In, First Out (LIFO) order
      acceptedRequests.sort((a, b) => new Date(b.date) - new Date(a.date));

      setRequests(acceptedRequests);
      setFilteredRequests(acceptedRequests);
    } catch (err) {
      setError("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (compId) {
      fetchRequests();
    }
  }, [compId]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/companion-booking/update-status/${bookingId}`,
        { status: newStatus }
      );

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

  const openPaymentModal = (request) => {
    setSelectedRequest(request);
    setAmount("");
    setShowModal(true);
  };

  const generatePaymentLink = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/payments/compnionpayment",
        { bookingId: selectedRequest._id, amount }
      );

      if (response.data.success) {
        setPaymentLinks((prev) => ({
          ...prev,
          [selectedRequest._id]: response.data.paymentLink,
        }));
        alert(`Payment link generated: ${response.data.paymentLink}`);
        setShowModal(false);
        fetchRequests();
      } else {
        alert("Failed to generate payment link.");
      }
    } catch (error) {
      console.error("Error generating payment link:", error);
      alert("Payment link generation failed.");
    }
  };

  const handleDateFilter = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);

    if (!selected) {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter(
      (req) => new Date(req.date).toISOString().split("T")[0] === selected
    );
    setFilteredRequests(filtered);
  };

  return (
    <div>
      <CompanionNav />
      <Container>
        <h2 className="my-4 text-center text-primary">Accepted Requests</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Date Filter */}
        <div className="d-flex justify-content-center mb-4">
          <Form.Group>
            <Form.Label className="fw-bold">Filter by Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateFilter}
              className="shadow-sm"
            />
          </Form.Group>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading requests...</p>
          </div>
        ) : (
          <Row>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Col md={6} key={request._id}>
                  <Card className="mb-4 shadow border-0 rounded">
                    <Card.Body>
                      <Card.Title className="fw-bold text-primary">
                        {request.patientName}
                      </Card.Title>
                      <Card.Text>
                        <strong>👤 Age:</strong> {request.age}
                      </Card.Text>
                      <Card.Text>
                        <strong>📝 Description:</strong> {request.description}
                      </Card.Text>
                      <Card.Text>
                        <strong>📅 Date:</strong>{" "}
                        {new Date(request.date).toLocaleDateString()}
                      </Card.Text>
                      <Card.Text>
                        <strong>📍 Address:</strong> {request.address}
                      </Card.Text>
                      <Card.Text>
                        <strong>📞 Phone:</strong> {request.phone}
                      </Card.Text>
                      <Card.Text>
                        <strong>🔖 Status:</strong>
                        <Badge
                          bg={
                            request.status === "confirmed"
                              ? "warning"
                              : request.status === "pickedup"
                              ? "primary"
                              : "success"
                          }
                          className="ms-2"
                        >
                          {request.status.toUpperCase()}
                        </Badge>
                      </Card.Text>

                      {/* Status update buttons */}
                      {request.paymentLink &&
                        request.isPaid &&
                        request.status !== "pickedup" &&
                        request.status !== "completed" && (
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() =>
                              handleUpdateStatus(request._id, "pickedup")
                            }
                          >
                            🚗 Mark as On the Way
                          </Button>
                        )}

                      {request.status === "pickedup" && (
                        <>
                          <Button
                            variant="success"
                            onClick={() =>
                              handleUpdateStatus(request._id, "completed")
                            }
                          >
                            ✅ Mark as Completed
                          </Button>
                          {/* View Location Button */}
                          <Button
                            variant="info"
                            className="mt-2"
                            onClick={() => setSelectedBookingId(request._id)}
                          >
                            View Location
                          </Button>
                        </>
                      )}

                      {/* Generate Payment Link */}
                      {request.status === "confirmed" &&
                        !request.paymentLink && (
                          <Button
                            variant="warning"
                            className="mt-2"
                            onClick={() => openPaymentModal(request)}
                          >
                            💰 Generate Payment Link
                          </Button>
                        )}

                      {/* Show if payment link is generated */}
                      {request.paymentLink && (
                        <p className="text-success mt-2">
                          ✅ Payment link sent!
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <p className="text-muted">No accepted requests found.</p>
              </Col>
            )}
          </Row>
        )}
      </Container>

      {/* Payment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Payment Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="amount">
              <Form.Label className="fw-bold">Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow-sm"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ❌ Close
          </Button>
          <Button variant="primary" onClick={generatePaymentLink}>
            🔗 Generate Link
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Companion Location Modal */}
      <Modal
        show={!!selectedBookingId}
        onHide={() => setSelectedBookingId(null)}
        size="lg"
        centered
      >
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

export default CompanionAcceptedRequest;
