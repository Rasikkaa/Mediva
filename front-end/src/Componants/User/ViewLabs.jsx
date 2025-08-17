
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Modal, Form, InputGroup, FormControl, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaUpload, FaSearch } from 'react-icons/fa'; //  Bootstrap Icons
import UserSidebar from './UserSidebar';

function ViewLabs() {
  const [labs, setLabs] = useState([]);
  const [files, setFiles] = useState({});
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [loading, setLoading] = useState(true);

  //  New State for User Address & Phone
  const [userAddress, setUserAddress] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userObjId");

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/laboratory-staff', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLabs(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchLabs();
  }, [token]);

  const handleFileChange = (event) => {
    if (selectedLab) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [selectedLab._id]: event.target.files[0],
      }));
    }
  };

  const handleSubmit = async () => {
    if (!files[selectedLab._id] || !userAddress || !userPhone) {
      alert('Please fill all fields and upload a prescription.');
      return;
    }

    const formData = new FormData();
    formData.append('labId', selectedLab._id);
    formData.append('prescription', files[selectedLab._id]);
    formData.append('userId', userId);
    formData.append('userAddress', userAddress);  //  Send User Address
    formData.append('userPhone', userPhone);      //  Send User Phone Number

    try {
      const response = await axios.post('http://localhost:8000/api/checkup', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response);
      alert('Checkup request sent successfully.');
      setShowModal(false);
      setUserAddress('');  //  Clear input after submission
      setUserPhone('');    //  Clear input after submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const filteredLabs = labs.filter(
    (lab) =>
      lab.labName.toLowerCase().includes(search) || lab.address.toLowerCase().includes(search)
  );

  return (
    <div className="d-flex">
      <UserSidebar />
      <Container className="mt-4" style={{ marginLeft: '300px' }}>
        <h2 className="mb-4 text-primary">🏥 Available Labs</h2>

        {/* 🔍 Search Input */}
        <InputGroup className="mb-4 shadow-sm">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Search by name or address"
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>

        {/* ⏳ Loading Spinner */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive className="shadow">
            <thead className="bg-primary text-white text-center">
              <tr>
                <th>Lab Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabs.length > 0 ? (
                filteredLabs.map((lab) => (
                  <tr key={lab._id} className="text-center">
                    <td>{lab.labName}</td>
                    <td>{lab.address}</td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>Call {lab.phone}</Tooltip>}>
                        <span className="text-primary">
                          <FaPhone size={18} className="me-2" />
                          {lab.phone}
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>Send Email</Tooltip>}>
                        <span className="text-danger">
                          <FaEnvelope size={18} className="me-2" />
                          {lab.email}
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => {
                          setSelectedLab(lab);
                          setShowModal(true);
                        }}
                      >
                        <FaUpload size={18} className="me-2" />
                        Upload Prescription
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-secondary">
                    No labs found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* 📂 Modal for File Upload */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Prescription for {selectedLab?.labName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* 📍 User Address Input */}
            <Form.Group controlId="formUserAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
              />
            </Form.Group>

            {/* 📞 User Phone Number Input */}
            <Form.Group controlId="formUserPhone" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </Form.Group>

            {/* 📎 File Upload */}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select Prescription</Form.Label>
              <Form.Control type="file" accept="image/*,.pdf" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewLabs;
