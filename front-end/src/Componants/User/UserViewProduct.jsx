
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import separately

import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import UserSidebar from "./UserSidebar";

const UserViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userObjId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/product", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const orderRes = await axios.post(
        "http://localhost:8000/api/payments/orders",
        { amount: selectedProduct.rentalPrice, currency: "INR" }
      );

      const options = {
        key: "rzp_test_PqciCl4tNBqXRv",
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Your Company",
        description: `Payment for ${selectedProduct.equipmentName}`,
        order_id: orderRes.data.order_id,
        handler: async function (response) {
          alert("Payment successful!");
          await confirmBooking(response.razorpay_payment_id);
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: phoneNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const generateInvoice = (booking, product) => {
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("INVOICE", 80, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 150, 30);
    doc.text(`Invoice ID: ${booking._id}`, 20, 40);
    
    doc.setFontSize(14);
    doc.text("Order Details:", 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Item: ${product.equipmentName}`, 20, 70);
    doc.text(`Price: ₹${product.rentalPrice}`, 20, 80);
    doc.text(`Service Fee: ₹${booking.price || product.rentalPrice}`, 20, 90);
    doc.text(`Status: ${booking.status || 'Booked'}`, 20, 100);
    doc.text(`Payment Status: ${booking.paymentStatus || 'PAID'}`, 20, 110);
    
    doc.line(20, 130, 190, 130);
    doc.text("Thank you for your order!", 70, 150);
    
    doc.save(`Invoice_${booking._id}.pdf`);
};

  const confirmBooking = async (paymentId) => {
    try {
      const response= await axios.post(
        "http://localhost:8000/api/bookings",
        {
          userId,
          productId: selectedProduct._id,
          paymentId,
          address,
          phoneNumber,
          status: "booked",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProduct._id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );

      alert("Booking confirmed!");
      setShowProductModal(false);
      setAddress("");
      setPhoneNumber("");

      generateInvoice(response.data, selectedProduct);

    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      <UserSidebar />
      <Container style={{ marginLeft: "16rem", padding: "20px", width: "100%" }}>
        <h2 className="text-center mt-4">Products</h2>
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : products.length > 0 ? (
          <Row>
            {products.map((product) => (
              <Col key={product._id} md={4} sm={6} className="mb-4">
                <Card className="shadow">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8000/${product.image}`}
                    alt={product.name}
                    style={{ height: "200px", objectFit: "scale-down" }}
                  />
                  <Card.Body>
                    <Card.Title>{product.equipmentName}</Card.Title>
                    <Card.Text className="text-primary fw-bold">₹{product.rentalPrice}</Card.Text>
                    <Card.Text className="text-muted">Available: {product.quantity}</Card.Text>
                    <Button
                      variant="info"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No products available.</p>
        )}

        <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Product: {selectedProduct?.equipmentName}</p>
            <p>Amount: <strong>₹{selectedProduct?.rentalPrice}</strong></p>
            
            <Form.Group controlId="address">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber" className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>Cancel</Button>
            <Button variant="success" disabled={selectedProduct?.quantity <= 0} onClick={initiatePayment}>Proceed to Payment</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default UserViewProduct;

