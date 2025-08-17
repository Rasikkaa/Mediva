
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Alert, Button } from "react-bootstrap";

function ShopViewBookings() {
  const shopId = localStorage.getItem("shopObjId");
  const token = localStorage.getItem("authToken");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/rentalshop/bookings/${shopId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort bookings by bookedAt (date) in descending order (latest first)
        const sortedBookings = response.data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (token) {
      fetchBookings();
    }
  }, [token]);

  // Function to handle returning a product
  const returnBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/bookings/return/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the UI after returning the product
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "returned" } : booking
        )
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error returning booking:", error);
      alert(error.response?.data?.message || "Failed to return booking.");
    }
  };

  return (
    <Container>
      <h2 className="text-center">Shop Bookings</h2>

      {bookings.length === 0 ? (
        <Alert variant="info" className="text-center">
          No bookings found
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Delivery Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.productId.equipmentName}</td>
                <td>{booking.userId.name}</td>
                <td>{booking.phoneNumber ? booking.phoneNumber : "N/A"}</td>
                <td>{new Date(booking.bookedAt).toLocaleString()}</td>
                <td>{booking.address ? booking.address : "N/A"}</td>
                <td>
                  <span className={`badge ${booking.status === "returned" ? "bg-success" : "bg-warning"}`}>
                    {booking.status === "returned" ? "Returned" : "Booked"}
                  </span>
                </td>
                <td>
                  {booking.status === "returned" ? (
                    <Button variant="secondary" disabled>
                      Returned
                    </Button>
                  ) : (
                    <Button variant="success" onClick={() => returnBooking(booking._id)}>
                      Return
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default ShopViewBookings;
