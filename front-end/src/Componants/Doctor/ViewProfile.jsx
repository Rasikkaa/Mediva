import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewProfile() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token and doctor ID from localStorage
  const token = localStorage.getItem('authToken');
  const doctorlogId = localStorage.getItem('doctorlogId');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/doctors/doctorhome/${doctorlogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        
        setDoctor(response.data); // Set the fetched doctor data in state
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setError('Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    if (token && doctorlogId) {
      fetchDoctor();
    } else {
      setError('Authentication details are missing.');
      setLoading(false);
    }
  }, [doctorlogId, token]);

  if (loading) return <div>Loading doctor profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h2>Doctor's Profile</h2>
      {doctor ? (
        <div className="doctor-profile">
          <img src={`http://localhost:8000/${doctor.image}`} alt={doctor.name} className="doctor-image" />
          <h3>{doctor.name}</h3>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Experience:</strong> {doctor.experience} years</p>
          <p><strong>Contact:</strong> {doctor.contact}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Hospital:</strong> {doctor.hospitalName}</p>
          {/* You can add more fields based on the data structure */}
        </div>
      ) : (
        <p>No doctor data available.</p>
      )}
    </div>
  );
}

export default ViewProfile;
