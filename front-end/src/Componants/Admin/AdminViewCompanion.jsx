
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";

function AdminViewCompanion({ onAddCompanion, onEditCompanion }) {
  const [companions, setCompanions] = useState([]);

  useEffect(() => {
    fetchCompanions();
  }, []);

  const fetchCompanions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/companion/allcompanion");
      setCompanions(response.data);
    } catch (error) {
      console.error("Error fetching companions:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this companion?")) {
      try {
        await axios.delete(`http://localhost:8000/api/companion/delete/${id}`);
        setCompanions(companions.filter(companion => companion._id !== id));
      } catch (error) {
        console.error("Error deleting companion:", error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Companion List</h2>
      <Button onClick={onAddCompanion} className="mb-3" variant="primary">
        Add Companion
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Age</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companions.length > 0 ? (
            companions.map((companion, index) => (
              <tr key={companion._id}>
                <td>{index + 1}</td>
                <td>{companion.name}</td>
                <td>{companion.phone}</td>
                <td>{companion.email}</td>
                <td>{companion.age}</td>
                <td>{companion.experience} years</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => onEditCompanion(companion)}>
                  <i className="fas fa-edit"></i> Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(companion._id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No companions found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminViewCompanion;
