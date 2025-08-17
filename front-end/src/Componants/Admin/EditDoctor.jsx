
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditDoctor({ doctorId }) {
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    specialization: '',
    workingHours: '',
    experience: '',
    image: '', 
  });

  const token = localStorage.getItem('authToken');

  // Fetch doctor details when component mounts
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/doctors/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        });
        console.log(response);
        
        setDoctor(response.data);

        // Set initial form data
        setFormData({
          name: response.data.name,
          email: response.data.email,
          contact: response.data.contact,
          specialization: response.data.specialization,
          workingHours: response.data.workingHours,
          experience: response.data.experience,
          image: response.data.image,
        });
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchDoctor();
  }, [doctorId, token]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Handle file input separately
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      // Handle text input
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      // Send PUT request to update doctor details
      const response = await axios.put(`http://localhost:8000/api/doctors/editdoctors/${doctorId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      });

      alert('Doctor details updated successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Something went wrong while updating doctor details.');
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="container w-75">
      <h2 className="text-center mb-4">Edit Doctor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-2">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled // Email is not editable
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="contact">Contact:</label>
          <input
            type="text"
            className="form-control"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="specialization">Specialization:</label>
          <input
            type="text"
            className="form-control"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="workingHours">Working Hours:</label>
          <input
            type="text"
            className="form-control"
            id="workingHours"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="experience">Experience (years):</label>
          <input
            type="number"
            className="form-control"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            className="form-control-file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-2">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditDoctor;
