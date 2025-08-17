
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, ListGroup, Badge, Navbar, Row, Col, Spinner, Modal, Form } from "react-bootstrap";


const BoyHome = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentAmounts, setPaymentAmounts] = useState({}); // Store payment amounts for each order
  const [paymentLinks, setPaymentLinks] = useState({}); // Store payment links
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders/allorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    

    fetchOrders();
  }, [token]);
   const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/orders/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  // Handle input change for payment amount
  const handleAmountChange = (orderId, value) => {
    setPaymentAmounts((prev) => ({ ...prev, [orderId]: value }));
  };

  // Send payment request
  const sendPaymentRequest = async (order) => {
    const amount = paymentAmounts[order._id]; // Get amount entered by delivery person
    const currency = "INR"; // Set default currency

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/payments/createLink",
        { amount, currency, orderId: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);

      if (response.data.success && response.data.paymentLink) {
        setPaymentLinks((prev) => ({ ...prev, [order._id]: response.data.paymentLink }));
        alert(`Payment request sent! Ask the user to pay via this link: ${response.data.paymentLink}`);
        fetchOrders()
      } else {
        alert("Failed to generate payment link.");
      }
    } catch (error) {
      console.error("Error sending payment request:", error);
      alert("Payment request failed. Try again.");
    }
  };

  return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" className="p-3">
        <Navbar.Brand className="mx-auto">Delivery Boy Dashboard</Navbar.Brand>
      </Navbar>

      {/* Welcome Section */}
      <Container className="text-center mt-4">
        <h2>Welcome, Delivery Partner! 🚚</h2>
        <p className="text-muted">Check your orders and update the delivery status.</p>
      </Container>

      <Container className="mt-4">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-muted">No orders available.</p>
        ) : (
          <Row>
            {orders.map((order) => (
              <Col md={4} sm={6} key={order._id} className="mb-4">
                <Card className="shadow-sm">
                  {order.imageUrl && (
                    <div className="text-center p-2">
                      <img
                        src={`http://localhost:8000/${order.imageUrl}`}
                        alt="Order Thumbnail"
                        style={{ width: "80px", height: "50px", objectFit: "cover", cursor: "pointer", borderRadius: "5px" }}
                        onClick={() => setSelectedImage(`http://localhost:8000/${order.imageUrl}`)}
                      />
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title>{order.orderText || "No Product Name"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Customer: {order.userId?.name || "Unknown"}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Address:</strong> {order.address || "Not Available"}<br/>
                      <strong>Phone:</strong> {order.phone}
                    </Card.Text>
                    
                    <ListGroup horizontal>
                      <ListGroup.Item>
                        Status:{" "}
                        <Badge
                          bg={order.status === "Pending" ? "warning" : order.status === "Out for Delivery" ? "primary" : "success"}
                          text="dark"
                        >
                          {order.status}
                        </Badge>
                      </ListGroup.Item>
                    </ListGroup>
                    <div className="mt-3">
                      {order.status !== "Delivered" && (
                        <Button
                          variant={order.status === "Pending" ? "primary" : "success"}
                          onClick={() => updateStatus(order._id, order.status === "Pending" ? "Out for Delivery" : "Delivered")}
                          disabled={!order.isPaid}
                        >
                          {order.status === "Pending" ? "Start Delivery" : "Mark as Delivered"}
                        </Button>
                      )}
                    </div>
                    {/* Input Field for Amount */}
                    {order.status === "Pending" && !order.paymentLink && (
                      <div className="mt-3">
                        <Form.Control
                          type="number"
                          placeholder="Enter amount"
                          value={paymentAmounts[order._id] || ""}
                          onChange={(e) => handleAmountChange(order._id, e.target.value)}
                        />
                        <Button variant="info" className="mt-2" onClick={() => sendPaymentRequest(order)}>
                          Request Payment
                        </Button>
                      </div>
                    )}

                    {/* Show Payment Link if available */}
                    {/* {paymentLinks[order._id] && (
                      <div className="mt-2">
                        <p><strong>Payment Link:</strong></p>
                        <a href={paymentLinks[order._id]} target="_blank" rel="noopener noreferrer">
                          Click here to pay
                        </a>
                      </div>
                    )} */}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered>
        <Modal.Body className="text-center">
          {selectedImage && <img src={selectedImage} alt="Full Image" style={{ width: "100%", height: "auto", borderRadius: "10px" }} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BoyHome;

