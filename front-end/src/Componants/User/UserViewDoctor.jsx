
import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Container, Modal } from "react-bootstrap";
import axios from "axios";
import UserSidebar from "./UserSidebar";

const UserViewDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [remainingTokens, setRemainingTokens] = useState(null);

  const userId = localStorage.getItem("userObjId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        alert("Failed to fetch doctors. Please try again.");
      }
    };
    fetchDoctors();
  }, [token]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setRemainingTokens(null); // Reset token count when opening modal
  };

  const handleChange = async (e) => {
    const selectedDate = e.target.value;
    setAppointmentDate(selectedDate);

    if (!selectedDoctor) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/appointments/available-tokens",
        { doctorId: selectedDoctor._id, date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRemainingTokens(response.data.remainingTokens);
    } catch (error) {
      console.error("Error fetching available tokens:", error);
      setRemainingTokens(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be logged in to book an appointment.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/appointments/book",
        { doctorId: selectedDoctor._id, userId, appointmentDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment booked successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  const filteredDoctors = searchTerm
    ? doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : doctors;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      <UserSidebar />
      <Container className="py-4" >
        <h2 className="text-center mb-4"> Doctors</h2>

        {/* Search Input */}
        <Form.Control
          type="text"
          placeholder="Search for a doctor by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 mx-auto"
          style={{ maxWidth: "600px" }}
        />

        {/* Doctors Grid */}
        <Row xs={1} md={2} lg={3} className="g-4" style={{marginLeft:'200px'}}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Col key={doctor._id}>
              <Card className="shadow-sm border-0 rounded" style={{ width: "300px", height: "400px", margin: "auto" }}>
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8000/${doctor.image}`}
                    style={{height: "200px", objectFit: "scale-down"}}  
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{doctor.name}</Card.Title>
                    <Card.Text>
                      <strong>Specialty:</strong> {doctor.specialization}
                      <br />
                      <strong>WorkingHours:</strong> {doctor.workingHours}<br/>
                      <strong>Contact:</strong> {doctor.contact}<br/>
                      <strong>Hospital:</strong> {doctor.hospitalName}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleBookAppointment(doctor)}>
                      Book Appointment
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No doctors found.</p>
          )}
        </Row>

        {/* Appointment Modal */}
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Book an Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 className="text-center">Dr. {selectedDoctor?.name}</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Date</Form.Label>
                <Form.Control type="date" value={appointmentDate} onChange={handleChange} required min={today} />
              </Form.Group>

              {/* Show remaining tokens */}
              {remainingTokens !== null && (
                <p className="text-center">
                  <strong>Remaining Tokens:</strong> {remainingTokens}
                </p>
              )}

              <Button type="submit" variant="success" className="w-100" disabled={remainingTokens === 0}>
                Confirm Booking
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default UserViewDoctor;
