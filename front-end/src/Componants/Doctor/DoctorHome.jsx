
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorViewAppoinments from './DoctorViewAppoinments';
import ViewProfile from './ViewProfile';
import { FaHome, FaCalendarAlt, FaUser, FaCog, FaSignOutAlt, FaStethoscope, FaBookMedical } from 'react-icons/fa'; // Icons for sidebar

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  doctorImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  sidebarItem: {
    marginBottom: '15px',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    textDecoration: 'none',
    color: '#ecf0f1',
    backgroundColor: '#34495e',
    textAlign: 'left',
    transition: 'background-color 0.3s, transform 0.3s',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sidebarItemHover: {
    backgroundColor: '#1abc9c',
    transform: 'scale(1.05)',
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1abc9c',
    color: '#fff',
    padding: '15px 20px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    transition: 'transform 0.3s',
  },
  cardHover: {
    transform: 'scale(1.02)',
  },
  quickLinks: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  quickLink: {
    flex: 1,
    backgroundColor: '#1abc9c',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  quickLinkHover: {
    backgroundColor: '#16a085',
  },
  calendar: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

function DoctorHome() {
  const doctorlogId = localStorage.getItem('doctorlogId');
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // Default view

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/doctors/doctorhome/${doctorlogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem('doctorObjId', response.data._id);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('doctorlogId');
    localStorage.removeItem('doctorObjId');
    navigate('/', { replace: true });
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {loading ? (
          <p style={{ color: '#ecf0f1' }}>Loading...</p>
        ) : doctor ? (
          <>
            <img src={`http://localhost:8000/${doctor.image}`} alt={doctor.name} style={styles.doctorImage} />
            <h3 style={{ color: '#ecf0f1' }}>{doctor.name}</h3>
            <p style={{ color: '#bdc3c7' }}>{doctor.specialization}</p>
            <div
              style={{
                ...styles.sidebarItem,
                ...(currentView === 'home' && styles.sidebarItemHover),
              }}
              onClick={() => handleNavigation('home')}
            >
              <FaHome /> Home
            </div>
            <div
              style={{
                ...styles.sidebarItem,
                ...(currentView === 'appointments' && styles.sidebarItemHover),
              }}
              onClick={() => handleNavigation('appointments')}
            >
              <FaCalendarAlt /> Appointments
            </div>
            <div
              style={{
                ...styles.sidebarItem,
                ...(currentView === 'profile' && styles.sidebarItemHover),
              }}
              onClick={() => handleNavigation('profile')}
            >
              <FaUser /> Profile
            </div>
            
            <div style={styles.sidebarItem} onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </div>
          </>
        ) : (
          <p style={{ color: '#ecf0f1' }}>No data available</p>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.header}>Welcome to Doctor Dashboard</div>

        {currentView === 'home' && (
          <div>
            {/* Quick Links */}
            <div style={styles.quickLinks}>
              <div
                style={styles.quickLink}
                onClick={() => handleNavigation('appointments')}
              >
                <FaCalendarAlt size={24} />
                <p>View Appointments</p>
              </div>
              <div
                style={styles.quickLink}
                onClick={() => handleNavigation('profile')}
              >
                <FaUser size={24} />
                <p> Profile</p>
              </div>
              <div
                style={styles.quickLink}
                onClick={() => window.open('https://www.ncbi.nlm.nih.gov/', '_blank')}
              >
                <FaBookMedical size={24} />
                <p>Medical Resources</p>
              </div>
            </div>

            {/* Upcoming Appointments */}
            {/* <div style={styles.card}>
              <h3>Upcoming Appointments</h3>
              <p>You have 2 appointments scheduled for today.</p>
            </div> */}

            {/* Recent Activity */}
            {/* <div style={styles.card}>
              <h3>Recent Activity</h3>
              <p>3 new patients registered this week.</p>
            </div> */}
          </div>
        )}

        {currentView === 'appointments' && <DoctorViewAppoinments />}
        {currentView === 'profile' && <ViewProfile />}
        {currentView === 'settings' && (
          <div style={styles.card}>
            <h3>Settings</h3>
            <p>Manage your account settings.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorHome;