import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

function EditCompanion({ companionId }) {
  const [companion, setCompanion] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    experience: "",
    gender: "",
  });

  const navigate = useNavigate();
console.log(companionId);

  useEffect(() => {
    if (companionId) {
      fetchCompanionDetails();
    }
  }, [companionId]);

  const fetchCompanionDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/companion/${companionId._id}`);
      console.log(response);
      
      setCompanion(response.data);
    } catch (error) {
      console.error("Error fetching companion details:", error);
    }
  };

  const handleChange = (e) => {
    setCompanion({ ...companion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/companion/update/${companionId._id}`, companion);
      alert("Companion updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating companion:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Edit Companion</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={companion.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={companion.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={companion.email}
            onChange={handleChange}
            required
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            name="age"
            value={companion.age}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Experience (years)</Form.Label>
          <Form.Control
            type="text"
            name="experience"
            value={companion.experience}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Select name="gender" value={companion.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">Update Companion</Button>
      </Form>
    </Container>
  );
}

export default EditCompanion;

