import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LabSidebar from './LabSidebar';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [labStaff, setLabStaff] = useState(null);

  const lablogId = localStorage.getItem('lablogId');

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!lablogId || !authToken) {
      navigate('/'); // Redirect to login if credentials are missing
    } else {
      fetchLabStaff();
    }
  }, [lablogId, authToken, navigate]);

  const fetchLabStaff = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/laboratory-staff/lab-staff/${lablogId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
console.log(response);
 localStorage.setItem('labobjId',response.data._id)
      
      setLabStaff(response.data);
    } catch (error) {
      console.error('Error fetching lab staff:', error);
    }
  };
  return (
    <>
      <LabSidebar />
      <div style={{ marginLeft: '16rem', padding: '20px', width: '100%' }}>
        <h2>Dashboard</h2>
        {labStaff ? (
          <div>
            <h3>Welcome, {labStaff.labName}!</h3>
            <p>Email: {labStaff.email}</p>
            <p>Phone: {labStaff.phone}</p>
            <p>Address: {labStaff.address}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
