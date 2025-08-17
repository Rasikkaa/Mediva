
// export default ViewProducts;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
// import './ViewProducts.css'; // Import custom CSS

function ViewProducts({ onEdit }) {
  const [products, setProducts] = useState([]);
  const shopId = localStorage.getItem('shopObjId');
  const token = localStorage.getItem('authToken');

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/product/shopview/${shopId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Delete
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI after deletion
      setProducts(products.filter((product) => product._id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <Container>
      <h1 className="my-4">View Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={product.image ? `http://localhost:8000/${product.image}` : 'placeholder-image-url.jpg'}
                alt={product.equipmentName}
                className="card-img-top"                                                                                                    
                style={{height: "200px", objectFit: "scale-down"}} 
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.equipmentName}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Quantity:{product.quantity}</Card.Text>
                <div className="mt-auto">
                  <Button variant="primary" className="me-2" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(product._id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ViewProducts;