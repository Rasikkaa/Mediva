
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar'; // Install react-calendar
import 'react-calendar/dist/Calendar.css'; // Import Calendar styles

function DoctorViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false); // For toggling the calendar view
  const token = localStorage.getItem('authToken');
  const doctorId = localStorage.getItem('doctorObjId');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/appointments/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setAppointments(response.data);
        filterAppointmentsByDate(new Date()); // Filter for today's appointments
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    fetchAppointments();
  }, [token, doctorId]);

  // Filter appointments for a specific date
  const filterAppointmentsByDate = (date) => {
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });
    setFilteredAppointments(filtered);
  };

  // Handle the date change from the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterAppointmentsByDate(date);
  };

  // Toggle Calendar View
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  // Handle Visit Checkbox change
  const handleVisitChange = async (appointmentId, status) => {
    try {
      await axios.put(
        `http://localhost:8000/api/appointments/${appointmentId}`,
        { status: status ? 'visited' : 'not-visited' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Update main appointments list
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: status ? 'visited' : 'not-visited' }
            : appointment
        )
      );
  
      // Update filtered appointments as well
      setFilteredAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: status ? 'visited' : 'not-visited' }
            : appointment
        )
      );
  
    } catch (error) {
      console.error("Error updating visit status", error);
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Doctor's Appointments</h2>

      {/* Button to toggle calendar view */}
      <button style={styles.button} onClick={toggleCalendar}>
        {showCalendar ? 'Close Calendar' : 'View Calendar'}
      </button>

      {/* If calendar is visible, show the calendar component */}
      {showCalendar && (
        <div style={styles.calendarWrapper}>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
      )}

      {/* Display today's appointments initially */}
      <div style={styles.appointmentList}>
        <h3>Appointments for {selectedDate.toLocaleDateString()}</h3>
        {filteredAppointments.length === 0 ? (
          <p>No appointments found for this date.</p>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} style={styles.appointmentCard}>
              <p><strong>Patient:</strong> {appointment.userId.name}</p>
              <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
              <p><strong>Token:</strong> {appointment.tokenNumber}</p>
              <label>
                <input
                  type="checkbox"
                  checked={appointment.status === 'visited'}
                  onChange={(e) => handleVisitChange(appointment._id, e.target.checked)}
                />
                Mark as Visited
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Styling for the component
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '28px',
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    marginBottom: '20px',
    backgroundColor: '#1abc9c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  calendarWrapper: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  appointmentList: {
    marginTop: '20px',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
  },
};

export default DoctorViewAppointments;
