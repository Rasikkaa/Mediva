import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

function BookingModal({ companion, onHide }) {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    description: "",
    date: "",
    address: "",
    phone: ""
  });

  const userId = localStorage.getItem("userObjId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Get the latitude and longitude using the provided address
      const geoResponse = await axios.post("http://localhost:8000/api/geocode", { address: formData.address });
      const { latitude, longitude } = geoResponse.data;

      // Create booking data including the geocoded coordinates
      const bookingData = {
        userId: userId,
        companionId: companion._id,
        ...formData,
        latitude,
        longitude,
      };

      const response = await axios.post("http://localhost:8000/api/companion-booking/create", bookingData);
      console.log(response);

      setSuccess("Booking successful!");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Error booking companion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={!!companion} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book {companion.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Patient Name</Form.Label>
            <Form.Control type="text" name="patientName" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control type="number" name="age" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" onChange={handleChange} required />
          </Form.Group>

          {/* Instead of separate latitude and longitude fields,
              the user simply enters an address */}
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your location address"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="tel" name="phone" onChange={handleChange} required />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Companion"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default BookingModal;
