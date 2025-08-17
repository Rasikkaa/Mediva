
import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import UserSidebar from "./UserSidebar";
import axios from "axios";
import styled from "styled-components";

// Styled components for custom styling
const StyledCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const StatusBadge = styled(Badge)`
  font-size: 0.9rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  display: inline-block;
`;

const BookingContainer = styled(Container)`
  margin-left: 16rem;
  padding: 20px;
  width: 100%;
`;

const BookingTitle = styled.h2`
  margin-bottom: 2rem;
  font-weight: bold;
  color: #333;
  
`;

const NoBookingsMessage = styled.p`
  text-align: center;
  color: #777;
  font-size: 1.2rem;
`;

function UserProductBooking() {
  const userId = localStorage.getItem("userObjId");
  const token = localStorage.getItem("authToken");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/bookings/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (userId && token) {
      fetchBookings();
    }
  }, [userId, token]);

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:8000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error.response.data.message);
    }
  };

  return (
    <Container fluid className="d-flex">
      <UserSidebar />
      <BookingContainer>
        <BookingTitle style={{textAlign:'center'}}>Product  Bookings</BookingTitle>
        <Row>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Col key={booking._id} md={4} className="mb-4">
                <StyledCard className="d-flex flex-column">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8000/${booking.productId.image}`}
                    style={{ height: "200px", objectFit: "scale-down" }}
                  />
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      
                      <Card.Title>{booking.productId.equipmentName}</Card.Title>
                      <Card.Text>
                        <strong>Booking Date:</strong>{" "}
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </Card.Text>
                      <Card.Text>
                        <strong>Price:</strong> ${booking.productId.rentalPrice}
                      </Card.Text>
                    </div>
                    <div>
                      <Button
                        variant="danger"
                        className="w-100"
                        onClick={() => cancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  </Card.Body>
                </StyledCard>
              </Col>
            ))
          ) : (
            <NoBookingsMessage>No bookings found.</NoBookingsMessage>
          )}
        </Row>
      </BookingContainer>
    </Container>
  );
}

export default UserProductBooking;