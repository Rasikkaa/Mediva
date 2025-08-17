import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminViewDoctor({ onEditDoctor,onAddDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchDoctors();
  }, []);
  const handleAddNew = () => {
    onAddDoctor(); // This will now correctly update the view
  }
  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/doctors', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Handle Delete
  const handleDelete = async (doctorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/doctors/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI after deletion
      setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
      alert('Doctor deleted successfully!');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Doctors List</h2>
        <button className="btn btn-primary" onClick={handleAddNew}>
          Add New +
        </button>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Working Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor._id}>
                <td>{index + 1}</td>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.experience} years</td>
                <td>{doctor.workingHours}</td>
                <td>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => onEditDoctor(doctor._id)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(doctor._id)}
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminViewDoctor;
