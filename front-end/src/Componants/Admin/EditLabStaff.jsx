import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

function EditLabStaff({ staffId, onCancel, onSave }) {
  const [staffDetails, setStaffDetails] = useState({
    labName: '',
    address: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch staff details when the component mounts or staffId changes
  useEffect(() => {
    if (staffId) {
      axios.get(`http://localhost:8000/api/laboratory-staff/${staffId}`)
        .then(response => {
          setStaffDetails({
            labName: response.data.labName || '',
            address: response.data.address || '',
            phone: response.data.phone || '',
          });
        })
        .catch(() => {
          setMessage('Failed to fetch staff details.');
        });
    }
  }, [staffId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!staffDetails.labName) newErrors.labName = 'Name is required';
    if (!staffDetails.address) newErrors.address = 'Address is required';
    if (!staffDetails.phone) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setMessage('');
    setErrors({});

    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.put(`http://localhost:8000/api/laboratory-staff/${staffId}`, staffDetails, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      
        console.log(response); // Debugging line
        setMessage(response.data.message || 'Laboratory staff updated successfully!'); //  Ensure success message is set
        // onSave(); // Trigger parent update
      } catch (error) {
        console.error("Update failed:", error);
        setMessage(error.response?.data?.error || 'Failed to update staff.');
      } finally {
        setLoading(false);
      }
    }      
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <h3 className="text-center mb-4">Edit Laboratory Staff</h3>
            
            {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Name Input */}
              <Form.Group controlId="labName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="labName"
                  value={staffDetails.labName}
                  onChange={handleChange}
                  isInvalid={!!errors.labName}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.labName}</Form.Control.Feedback>
              </Form.Group>

              {/* Address Input */}
              <Form.Group controlId="address" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={staffDetails.address}
                  onChange={handleChange}
                  isInvalid={!!errors.address}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              </Form.Group>

              {/* Phone Input */}
              <Form.Group controlId="phone" className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={staffDetails.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>

              {/* Buttons */}
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditLabStaff;
