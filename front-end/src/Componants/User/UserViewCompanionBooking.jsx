import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from "react-bootstrap";
import UserSidebar from "./UserSidebar";
import CompanionMap from "../Companion/CompanionMap";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
function UserViewCompanionBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null); // For location modal
  const userId = localStorage.getItem("userObjId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/companion-booking/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.bookings);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanionPickup = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8000/api/bookings/pickup/${bookingId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Companion has picked up the patient.");
      fetchBookings(); // Refresh bookings
    } catch (err) {
      setError("Failed to update pickup status");
    }
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

  // Handle Payment
  const handlePayment = async (booking) => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/payments/orders",
        { amount: booking.price, orderId: booking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_PqciCl4tNBqXRv", // Replace with your Razorpay Key
        amount: booking.price * 100,
        currency: "INR",
        name: "Companion Booking Payment",
        description: `Payment for Booking #${booking._id}`,
        order_id: response.data.orderId,
        handler: async (paymentResponse) => {
          alert("Payment successful!");
          console.log("Payment Details:", paymentResponse);

          // Update payment status in backend
          try {
            await axios.put(
              `http://localhost:8000/api/companion-booking/update-payment/${booking._id}`,
              { isPaid: true },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchBookings(); // Refresh bookings
            generateInvoice(booking);
          } catch (error) {
            console.error("Error updating payment status:", error);
          }
        },
        prefill: {
          email: "user@example.com",
          contact: "9999999999", // Change to user's phone
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
  const generateInvoice = (booking) => {
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Invoice", 80, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${formattedDate}`, 150, 30);
    doc.text(`Invoice ID: ${booking._id}`, 20, 40);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details:", 20, 60);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Service: Companion Service`, 20, 70);
    doc.text(`Patient: ${booking.patientName || "Name Notavailable"}`, 20, 80);
    doc.text(`Total Amount: ₹${booking.price || "N/A"}`, 20, 90);
    doc.text(`Status: ${booking.status || "Booked"}`, 20, 100);
    doc.text(`Payment Status: ${booking.paymentStatus || "PAID"}`, 20, 110);

    doc.setTextColor(0, 0, 0); // Reset text color
    doc.line(20, 130, 190, 130);
    doc.text("Thank you for your order!", 70, 150);

    doc.save(`Invoice_${booking._id}.pdf`);
};

  return (
    <div className="d-flex">
      <UserSidebar />

      <Container className="mt-4" style={{ marginLeft: "280px", padding: "20px", width: "75%" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bookings</h2>
        <Link to="/userCompanion" >
        <button className="btn btn-primary" >
         Companion
        </button>
        </Link>
      </div>
  
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row>
            {bookings.length > 0 ? (
              bookings.slice().reverse().map((booking) => (
                <Col md={6} key={booking._id}>
                  <Card className="shadow-sm mb-3">
                    <Card.Body>
                      <Card.Title>Booking ID: {booking._id}</Card.Title>
                      <Card.Text>Companion: {booking.companionId.name}</Card.Text>
                      <Card.Text>Status: {booking.patientName||''}</Card.Text>
                      <Card.Text>Status: {booking.status}</Card.Text>
                      {booking.price && <Card.Text>Price: ₹{booking.price}</Card.Text>}


                      {booking.isPaid ? (
  <Button variant="success" disabled>Paid</Button>
) : (
  booking.price ? (
    <Button variant="warning" onClick={() => handlePayment(booking)}>
      Pay Now ₹{booking.price}
    </Button>
  ) : (
    <Button variant="secondary" disabled>{booking.status}</Button> // Display status only if no price
  )
)}


                      {booking.status === "pickedup" && (
                        <Button
                                              variant="info"
                                              className="ms-2"
                                              onClick={() => setSelectedBookingId(booking._id)}
                        >                                                           
                          View Location
                        </Button>
                      )}

                      {booking.status === "Booked" && (
                        <Button
                          variant="secondary"
                          className="ms-2"
                          onClick={() => handleCompanionPickup(booking._id)}
                        >
                          Mark as On the Way
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center">No bookings found.</p>
            )}
          </Row>
        )}
      </Container>

      {/* Companion Location Modal */}
      <Modal show={!!selectedBookingId} onHide={() => setSelectedBookingId(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Companion Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBookingId && <CompanionMap bookingId={selectedBookingId} />}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserViewCompanionBooking;
