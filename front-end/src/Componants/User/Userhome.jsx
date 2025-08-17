
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f8ff',
    padding: '20px',
    // maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft:'16rem'
  
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '20px',
    flexWrap: 'wrap',

  },
  navItem: {
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#3498db',
    border: '2px solid #3498db',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  navItemHover: {
    backgroundColor: '#3498db',
    color: '#fff',
    transform: 'scale(1.05)',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    padding: '20px',
    marginLeft:'16rem'
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  cardText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#7f8c8d',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginLeft: '20px',
  },
  logoutButtonHover: {
    backgroundColor: '#c0392b',
  },
};

function Userhome() {
  const userId = localStorage.getItem('userlogId');
  const [user, setUser] = useState();
  const navigate = useNavigate();  // Used for programmatic navigation

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve the token
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/users/home/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass token in Authorization header
        },
      });

      console.log(response);
      setUser(response.data);
      localStorage.setItem('userObjId', response.data._id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userlogId');
    localStorage.removeItem('userObjId');
  
    // Replace the history state before navigating
    window.history.replaceState(null, '', '/');
  
    navigate('/', { replace: true });
  };
  
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        Welcome to User Dashboard
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.logoutButton.backgroundColor}
        >
          Logout
        </button>
      </div>

      {/* Navigation Bar */}
      {/* <div style={styles.nav}>
        <a
          href="/userviewdoctor"
          style={styles.navItem}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.navItemHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.navItem.backgroundColor}
        >
          View Doctors
        </a>
        <a
          href="/userviewbooking"
          style={styles.navItem}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.navItemHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.navItem.backgroundColor}
        >
          Bookings
        </a>
        <a
          href="#view-groceries"
          style={styles.navItem}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.navItemHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.navItem.backgroundColor}
        >
          View Groceries
        </a>
        <a
          href="#view-medicines"
          style={styles.navItem}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.navItemHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.navItem.backgroundColor}
        >
          View Medicines
        </a>
        <a
          href="/userviewproduct"
          style={styles.navItem}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.navItemHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.navItem.backgroundColor}
        >
          View Rental Products
        </a>
      </div> */}

      <UserSidebar />
      
      {/* Content Cards */}
      <div style={styles.content}>
        <Link to={'/userviewdoctor'} style={{textDecoration:'none'}}>
        <div
          style={styles.card}
          id="view-doctor"
          onMouseEnter={(e) => e.target.style.transform = styles.cardHover.transform}
          onMouseLeave={(e) => e.target.style.transform = 'none'}
        >
          <h3 style={styles.cardTitle}>Doctors</h3>
          <p style={styles.cardText}>Find the best doctors in your area and view their profiles.</p>
        </div>
        </Link>
        <Link to={'/view-Lab'} style={{textDecoration:'none'}}>
        <div
          style={styles.card}
          id="book-doctor"
          onMouseEnter={(e) => e.target.style.transform = styles.cardHover.transform}
          onMouseLeave={(e) => e.target.style.transform = 'none'}
        >
          <h3 style={styles.cardTitle}>Lab</h3>
          <p style={styles.cardText}>Book lab tests and view results conveniently online.</p>
        </div>
</Link>
<Link to={'/groceries'} style={{textDecoration:'none'}}>
        <div
          style={styles.card}
          id="view-groceries"
          onMouseEnter={(e) => e.target.style.transform = styles.cardHover.transform}
          onMouseLeave={(e) => e.target.style.transform = 'none'}
        >
          <h3 style={styles.cardTitle}> Groceries</h3>
          <p style={styles.cardText}>Browse and shop for essential groceries with ease.</p>
        </div>
        </Link>
        <Link to={'/userCompanion'} style={{textDecoration:'none'}}>
        <div
          style={styles.card}
          id="view-medicines"
          onMouseEnter={(e) => e.target.style.transform = styles.cardHover.transform}
          onMouseLeave={(e) => e.target.style.transform = 'none'}
        >
          <h3 style={styles.cardTitle}> Companion</h3>
          <p style={styles.cardText}>Find a trusted companion for support and assistance.</p>
        </div>
        </Link>
        <Link to={'/userviewproduct'} style={{textDecoration:'none'}}>
        <div
          style={styles.card}
          id="view-appointments"
          onMouseEnter={(e) => e.target.style.transform = styles.cardHover.transform}
          onMouseLeave={(e) => e.target.style.transform = 'none'}
        >
          <h3 style={styles.cardTitle}> Products</h3>
          <p style={styles.cardText}>Discover a wide range of products tailored to your needs.</p>
        </div>
        </Link>
      </div>
    </div>
  );
}

export default Userhome;
