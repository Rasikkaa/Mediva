
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function AddDoctor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contact: '',
    email: '',
    experience: '',
    workingHours: '',
    totalAppointments: '',
    hospitalName: '',
    image: null,
    password: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required.';
    if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required.';
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required.';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact must be a 10-digit number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required.';
    } else if (isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = 'Experience must be a positive number.';
    }

    if (!formData.totalAppointments.trim()) {
      newErrors.totalAppointments = 'Total appointments is required.';
    } else if (isNaN(formData.totalAppointments) || formData.totalAppointments < 1) {
      newErrors.totalAppointments = 'Appointments must be at least 1.';
    }

    if (!formData.workingHours.trim()) newErrors.workingHours = 'Working hours are required.';
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/doctors/addDoctor',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      navigate('/admin');
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Add Doctor</h2>
      <form onSubmit={handleSubmit} className="border p-4 shadow-sm rounded bg-light">
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Specialization', name: 'specialization', type: 'text' },
          { label: 'Hospital Name', name: 'hospitalName', type: 'text' },
          { label: 'Contact', name: 'contact', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Experience (Years)', name: 'experience', type: 'number' },
          { label: 'Working Hours', name: 'workingHours', type: 'text' },
          { label: 'Total Appointments per Day', name: 'totalAppointments', type: 'number' },
        ].map(({ label, name, type }) => (
          <div className="mb-3" key={name}>
            <label htmlFor={name} className="form-label">{label}</label>
            <input
              type={type}
              className="form-control"
              id={name}
              name={name}
              placeholder={`Enter ${label.toLowerCase()}`}
              value={formData[name]}
              onChange={handleChange}
            />
            {errors[name] && <small className="text-danger">{errors[name]}</small>}
          </div>
        ))}

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Upload Image</label>
          <input type="file" className="form-control" id="image" name="image" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">Add Doctor</button>
        </div>
      </form>
    </div>
  );
}

export default AddDoctor;
