

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserMd, FaShoppingCart, FaPills, FaClipboardList, FaSignOutAlt, FaHome, FaTags, FaUserFriends } from 'react-icons/fa';

const styles = {
  sidebar:{
    width: "16rem", // Fixed width
    // height: "100vh", // Fu
    position: "fixed", // Sidebar stays fixed
    top: 0, // Stick to top
    left: 0, // Stick to left
    backgroundColor: "#1E3A8A",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto", // Enable scrolling if content overflows
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'white',
    transition: 'background 0.3s',
  },
  navItemHover: {
    backgroundColor: '#1E40AF',
  },
  logoutButton: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#DC2626',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#B91C1C',
  }
};

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userlogId');
    localStorage.removeItem('userObjId');
    navigate('/', { replace: true });
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>User Dashboard</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/user-home" style={styles.navItem}>
          <FaHome /> Home
        </Link>
        <Link to="/userviewdoctor" style={styles.navItem}>
          <FaUserMd />  Doctors
        </Link>
        <Link to="/userviewbooking" style={styles.navItem}>
          <FaClipboardList /> Bookings
        </Link>
        <Link to="/groceries" style={styles.navItem}>
          <FaShoppingCart />  Groceries
        </Link>
        <Link to="/view-Lab" style={styles.navItem}>
          <FaPills /> Lab
        </Link>
        <Link to="/mycheckups" style={ styles.navItem }>
            <FaClipboardList /> Checkups
          </Link>
        <Link to="/userviewproduct" style={styles.navItem}>
          <FaTags /> Products
        </Link>
         {/* <Link to="/userCompanion" style={styles.navItem}>
          <FaUserFriends /> Companion
        </Link> */}
        <Link to="/usercompanionbookings" style={styles.navItem}>
        <FaUserFriends /> companionbookings
        </Link>
       
        <Link to="/userproductbookings" style={styles.navItem}>
          <FaTags /> Products bookings
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        style={styles.logoutButton}
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default UserSidebar;

