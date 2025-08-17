
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import axios from 'axios';

function ShopEditProduct({ product, onSave }) {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    equipmentName: '',
    image: null, // Single file for image
    lastMaintenance: '',
    nextMaintenance: '',
    quantity: '',
    rentalPrice: '',
  });

  const [imagePreview, setImagePreview] = useState(null); // Single image preview
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (product) {
      setFormData({
        category: product.category || '',
        description: product.description || '',
        equipmentName: product.equipmentName || '',
        image: null, // Reset image when product changes
        lastMaintenance: product.lastMaintenance || '',
        nextMaintenance: product.nextMaintenance || '',
        quantity: product.quantity || '',
        rentalPrice: product.rentalPrice || '',
      });

      setImagePreview(product.image ? `http://localhost:8000/${product.image}` : null); // Set preview from existing image
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const selectedFile = files[0]; // Single file
      setFormData((prevData) => ({
        ...prevData,
        image: selectedFile,
      }));

      // Generate image preview
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (key === 'image' && formData.image) {
        formDataToSend.append('image', formData.image); // Send single image
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/product/editproduct/${product._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update product');
      }

      onSave(response.data);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4>Edit Product</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="equipmentName" className="mb-3">
                  <Form.Label>Equipment Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="equipmentName"
                    value={formData.equipmentName}
                    onChange={handleChange}
                    placeholder="Enter equipment name"
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                  />
                </Form.Group>

                <Form.Group controlId="rentalPrice" className="mb-3">
                  <Form.Label>Rental Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="rentalPrice"
                    value={formData.rentalPrice}
                    onChange={handleChange}
                    placeholder="Enter rental price"
                  />
                </Form.Group>

                <Form.Group controlId="category" className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Construction">Construction</option>
                    <option value="Tools">Tools</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </Form.Group>

                {/* Display image preview */}
                {imagePreview && (
                  <div className="text-center mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  </div>
                )}

                <Row>
                  <Col>
                    <Form.Group controlId="lastMaintenance" className="mb-3">
                      <Form.Label>Last Maintenance</Form.Label>
                      <Form.Control
                        type="date"
                        name="lastMaintenance"
                        value={formData.lastMaintenance}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="nextMaintenance" className="mb-3">
                      <Form.Label>Next Maintenance</Form.Label>
                      <Form.Control
                        type="date"
                        name="nextMaintenance"
                        value={formData.nextMaintenance}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="quantity" className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="primary" type="submit" className="w-25">
                Save
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ShopEditProduct;