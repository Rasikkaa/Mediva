import React, { useEffect, useState } from 'react';
import AddProduct from './AddProduct';
import './RentalShophome.css'; // Import the updated CSS
import axios from 'axios';
import ViewProducts from './ViewProducts';
import ShopEditProduct from './ShopEditProduct';
import { useNavigate } from 'react-router-dom';
import ShopViewBookings from './ShopViewBookings';
import { FaCalendarAlt, FaListAlt, FaPlusCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

function RentalShophome() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [availableProducts, setAvailableProducts] = useState(0);
  const [newBookings, setNewBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [shopData, setShop] = useState('');
  const [productToEdit, setProductToEdit] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const shopId = localStorage.getItem('shoplogId');
  // Fetch shop data
  async function fetchShopData() {
    
  
    try {
      const response = await axios.get(`http://localhost:8000/api/rentalshop/${shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setShop(response.data);
      localStorage.setItem('shopObjId', response.data._id);
  
      // Ensure fetchCounts runs after shopObjId is set
      fetchCounts(response.data._id);
    } catch (error) {
      console.error('Error fetching shop data:', error);
    }
  }
  
  async function fetchCounts(shopId) {
   
    try {
      const response = await axios.get(`http://localhost:8000/api/rentalshop/${shopId}/counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { totalProducts, availableProducts, newBookings, completedBookings } = response.data;
  
      setTotalProducts(totalProducts);
      setAvailableProducts(availableProducts);
      setNewBookings(newBookings);
      setCompletedBookings(completedBookings);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  }
  
  useEffect(() => {
    fetchShopData();
  }, []);
  
  // Handle navigation
  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  // Handle product edit
  const handleEdit = (product) => {
    setProductToEdit(product);
    setCurrentView('editProduct');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('shopObjId');
    localStorage.removeItem('shoplogId');
    navigate('/', { replace: true });
  };

  return (
    <div className="shop_rental-home">
      {/* Sidebar */}
      <div className="shop_sidebar">
        <div className="shop_profile">
          <h2 className="shop_profile-name">{shopData.shopName}</h2>
        </div>
        <ul className="shop_nav">
          <li>
            <a
              href="#"
              className={currentView === 'dashboard' ? 'active' : ''}
              onClick={() => handleNavigation('dashboard')}
            >
              <FaTachometerAlt /> Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className={currentView === 'addProduct' ? 'active' : ''}
              onClick={() => handleNavigation('addProduct')}
            >
              <FaPlusCircle /> Add Product
            </a>
          </li>
          <li>
            <a
              href="#"
              className={currentView === 'bookings' ? 'active' : ''}
              onClick={() => handleNavigation('bookings')}
            >
              <FaCalendarAlt /> Bookings
            </a>
          </li>
          <li>
            <a
              href="#"
              className={currentView === 'viewproduct' ? 'active' : ''}
              onClick={() => handleNavigation('viewproduct')}
            >
              <FaListAlt /> View Products
            </a>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="shop_content">
        {currentView === 'dashboard' && (
          <>
            <h1 className="shop_content-title">Dashboard</h1>
            <div className="shop_dashboard-grid">
              <div className="shop_card shop_card-blue">
                <h3>Total Products</h3>
                <span className="shop_card-text">{totalProducts}</span>
              </div>
              <div className="shop_card shop_card-light-blue">
                <h3>Available Products</h3>
                <span>{availableProducts}</span>
              </div>
          
              <div className="shop_card shop_card-orange">
                <h3> Bookings</h3>
                <span>{completedBookings}</span>
              </div>
            </div>
          </>
        )}

        {currentView === 'addProduct' && <AddProduct />}
        {currentView === 'viewproduct' && <ViewProducts onEdit={handleEdit} />}
        {currentView === 'editProduct' && (
          <ShopEditProduct product={productToEdit} onSave={() => setCurrentView('viewproduct')} />
        )}
        {currentView === 'bookings' && <ShopViewBookings />}
      </div>
    </div>
  );
}

export default RentalShophome;