import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EditRentalShop({ shopId }) {
  const [shopDetails, setShopDetails] = useState({
    shopName: '',
    email: '',
    phone: '',
    address: ''
  });
console.log(shopId);
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
        if (!token) {
          alert('Unauthorized: No token found');
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/rentalshop/${shopId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log(response);

        setShopDetails(response.data);
      } catch (error) {
        console.error('Error fetching shop details:', error);
        alert('Failed to fetch shop details.');
      }
    };

    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId]);

  const handleChange = (e) => {
    setShopDetails({ ...shopDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Unauthorized: No token found');
        return;
      }

      await axios.put(`http://localhost:8000/api/rentalshop/${shopId}`, shopDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Rental shop details updated successfully!');
    } catch (error) {
      console.error('Error updating shop details:', error);
      alert('Failed to update shop details.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Rental Shop</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="shopName"
            className="form-control"
            value={shopDetails.shopName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={shopDetails.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={shopDetails.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={shopDetails.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Shop
        </button>
      </form>
    </div>
  );
}
export default EditRentalShop;
