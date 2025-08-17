
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import UserSidebar from "./UserSidebar";

const Container = styled.div`
  display: flex;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  flex: 1;
  margin-left: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const BookingCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 10px;
  }

  p {
    margin: 5px 0;
  }

  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #777;
`;

const CancelButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #cc0000;
  }
`;

const DateHeader = styled.h3`
  color: #555;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 2px solid #ddd;
`;

const UserViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userObjId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        if (!token) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/appointments/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId, token]);

  // Function to cancel an appointment
  const handleCancelAppointment = async (appointmentId, doctorId, appointmentDate) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/appointments/cancel/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);

      // Remove canceled appointment from state
      setBookings(bookings.filter((appt) => appt._id !== appointmentId));

      // Fetch updated available tokens (Optional)
      fetchAvailableTokens(doctorId, appointmentDate);
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment.");
    }
  };

  // Fetch available tokens after canceling
  const fetchAvailableTokens = async (doctorId, date) => {
    try {
      const response = await axios.post("http://localhost:8000/api/appointments/available-tokens", { doctorId, date });
      console.log("Updated tokens:", response.data.remainingTokens);
    } catch (error) {
      console.error("Error fetching available tokens:", error);
    }
  };

  // Group bookings by date
  const groupBookingsByDate = (bookings) => {
    return bookings.reduce((grouped, booking) => {
      const date = new Date(booking.appointmentDate).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(booking);
      return grouped;
    }, {});
  };

  const groupedBookings = groupBookingsByDate(bookings);

  return (
    <Container>
      <UserSidebar />
      <Content style={{ marginLeft: "16rem", padding: "20px", width: "100%" }}>
      
        <Title>My Bookings</Title>
        {loading ? (
          <EmptyMessage>Loading your bookings...</EmptyMessage>
        ) : bookings.length === 0 ? (
          <EmptyMessage>No bookings found.</EmptyMessage>
        ) : (
          Object.entries(groupedBookings).map(([date, bookings]) => (
            <div key={date}>
              <DateHeader>{date}</DateHeader>
              {bookings.map((booking) => (
                <BookingCard key={booking._id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={`http://localhost:8000/${booking.doctorId.image}`} alt="Doctor" />
                    <div>
                      <h3>{booking.doctorId.name}</h3>
                      <p>Specialization: {booking.doctorId.specialization}</p>
                      <p>Appointment Date: {new Date(booking.appointmentDate).toLocaleDateString()}</p>
                      <p>Status: {booking.status}</p>
                      <h4>Token: {booking.tokenNumber}</h4>
                      {booking.status !== "visited" && (
  <CancelButton 
    onClick={() => handleCancelAppointment(booking._id, booking.doctorId._id, booking.appointmentDate)}
  >
    Cancel Appointment
  </CancelButton>
)}
                    </div>
                  </div>
                </BookingCard>
              ))}
            </div>
          ))
        )}
      </Content>
    </Container>
  );
};

export default UserViewBookings;