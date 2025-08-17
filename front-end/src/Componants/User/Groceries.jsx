
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Spinner, Card, ListGroup, Badge } from "react-bootstrap";
import { FaCheckCircle, FaUpload } from "react-icons/fa";
import UserSidebar from "./UserSidebar";
import jsPDF from "jspdf";
function Groceries() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userObjId");

  const [orderText, setOrderText] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  // Fetch Order History
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, [userId, token]);

  const handleTextChange = (e) => setOrderText(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // Submit Order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!orderText.trim() || !address.trim() || !phone.trim() || phone.length !== 10) {
      alert("Please fill all fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("orderText", orderText);
    formData.append("address", address);
    formData.append("phone", phone);
    if (image) formData.append("image", image);
    formData.append("userId", userId);

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/orders", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Order placed successfully!");
      setOrderText("");
      setAddress("");
      setPhone("");
      setImage(null);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order.");
    }
    setLoading(false);
  };

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Payment via Razorpay
  const handlePayment = async (order) => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay. Check your internet connection.");
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/api/payments/orders",
        { amount: order.price, orderId: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

     
        const options = {
          key: "rzp_test_PqciCl4tNBqXRv", // Replace with Razorpay Key
          amount: order.price * 100,
          currency: "INR",
          name: "Grocery Order",
          description: `Order #${order._id}`,
          order_id: response.data.orderId,
          handler:async (paymentResponse) => {
            alert("Payment successful!");
            generateInvoice(order)
            console.log("Payment Details:", paymentResponse);
            
        // Update order payment status in the backend
        try {
          await axios.put(
            `http://localhost:8000/api/orders/payment/${order._id}`,
            { paymentStatus: "Paid" },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Refresh order history after updating payment status
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o._id === order._id ? { ...o, isPaid: true } : o
            )
          );
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
          },
          prefill: {
            email: "user@example.com",
            contact: phone,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed.");
    }
  };
  const generateInvoice = (order) => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Grocery Order Invoice", 70, 20);
    doc.setFontSize(12);
    doc.text(`Invoice ID: INV-${order._id.slice(-6)}`, 20, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Phone: ${order.phone}`, 20, 80);
    doc.text(`Delivery Address: ${order.address}`, 20, 90);
    doc.setFontSize(14);
    doc.text("Order Details:", 20, 110);
    doc.setFontSize(12);
    doc.text(`Items: ${order.orderText}`, 20, 120);
    doc.text(`Total Amount: ₹${order.price}`, 20, 130);
    
    doc.text("Payment Status: PAID", 20, 150);
  

    doc.setTextColor(0, 0, 0); // Reset text color
    doc.line(20, 160, 190, 160);
    doc.text("Thank you for your order!", 70, 180);
    
    doc.save(`Invoice-${order._id.slice(-6)}.pdf`);
  };
  return (
    <>
      <UserSidebar />
      <Container className="mt-5 p-4 border rounded shadow-lg" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">Order Groceries or Medicines</h2>
        <Form onSubmit={handleSubmitOrder}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter items to order..."
              value={orderText}
              onChange={handleTextChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter delivery address"
              value={address}
              onChange={handleAddressChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={handlePhoneChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center gap-2">
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            <FaUpload size={20} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Submit Order"}
          </Button>
        </Form>

        {/* Order History Section */}
        <h3 className="mt-5">Order History</h3>
        {orders.length === 0 ? (
          <p className="text-muted">No past orders found.</p>
        ) : (
          <ListGroup className="mt-3">
            {orders.slice().reverse().map((order) => (
              <Card key={order._id} className="mb-3 shadow">
                <Card.Body>
                  <Card.Title>Order #{order._id.slice(-6)}</Card.Title>
                  <Card.Text>
                    <strong>Items:</strong> {order.orderText} <br />
                    <strong>Address:</strong> {order.address} <br />
                    <strong>Phone:</strong> {order.phone} <br />
                    <strong>Status:</strong>{" "}
                    <Badge bg={order.status === "Pending" ? "warning" : "success"}>
                      {order.status}
                    </Badge>

                  </Card.Text>

                  {order.imageUrl && (
                    <div className="mb-2">
                      <strong>Uploaded Image:</strong>
                      <br />
                      <img
                        src={`http://localhost:8000/${order.imageUrl}`}
                        alt="Order"
                        style={{ width: "100px", borderRadius: "5px" }}
                      />
                    </div>
                  )}
                 {/* {order.isPaid && (
  <span className="badge bg-success">Paided</span>
)} */}{order.isPaid && (
  <span style={{ 
    display: "inline-flex", 
    alignItems: "center", 
    backgroundColor: "green", 
    color: "white", 
    padding: "5px 10px", 
    borderRadius: "5px",
    fontWeight: "bold"
  }}>
    <FaCheckCircle style={{ marginRight: "5px" }} /> Paid
  </span>
)}
                 {!order.isPaid && order.paymentLink && (
  <Button variant="success" onClick={() => handlePayment(order)}>
    Pay Now
  </Button>
)}

                  <Badge bg="info">{new Date(order.createdAt).toLocaleString()}</Badge>
                </Card.Body>
              </Card>
            ))}
          </ListGroup>
        )}
      </Container>
    </>
  );
}

export default Groceries;
