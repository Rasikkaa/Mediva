import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';

function AddCompanion() {
  const [companion, setCompanion] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    age: '',
    experience: '',
    gender: '',
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanion({ ...companion, [name]: value });
  };

  const handleImageChange = (e) => {
    setCompanion({ ...companion, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('username', companion.username);
    formData.append('password', companion.password);
    formData.append('name', companion.name);
    formData.append('phone', companion.phone);
    formData.append('email', companion.email);
    formData.append('age', companion.age);
    formData.append('experience', companion.experience);
    formData.append('gender', companion.gender);
    if (companion.image) {
      formData.append('image', companion.image);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/companion', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response);
      
      setMessage('Companion registered successfully!');
      setCompanion({ username: '', password: '', name: '', phone: '', email: '', age: '', experience: '', gender: '', image: null });
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow p-4">
        <h2 className="text-center mb-4">Add Companion</h2>
        
        {message && <Alert variant={message.includes('Error') ? 'danger' : 'success'}>{message}</Alert>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={companion.username} onChange={handleChange} placeholder="Enter username" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={companion.password} onChange={handleChange} placeholder="Enter password" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={companion.name} onChange={handleChange} placeholder="Enter full name" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="phone" value={companion.phone} onChange={handleChange} placeholder="Enter phone number" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={companion.email} onChange={handleChange} placeholder="Enter email" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control type="number" name="age" value={companion.age} onChange={handleChange} placeholder="Enter age" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Experience (Years)</Form.Label>
            <Form.Control type="text" name="experience" value={companion.experience} onChange={handleChange} placeholder="Enter experience in years" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select name="gender" value={companion.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" name="image" accept="image/*" onChange={handleImageChange} required />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading} className="w-100">
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Register Companion'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AddCompanion;
