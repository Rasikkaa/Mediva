import axios from "axios";
import React, { useState } from "react";

function AddProduct() {
  // State to handle form inputs
  const [formData, setFormData] = useState({
    equipmentName: "",
    category: "",
    description: "",
    quantity: "",
    condition: "",
    rentalPrice: "",
    securityDeposit: "",
    lastMaintenance: "",
    nextMaintenance: "",
    image: null, // Change from array to single file
  });

  const shopId = localStorage.getItem("shopObjId");
  const token = localStorage.getItem("authToken");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change for a single image
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Store only the first file
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formDataToSend = new FormData();

    // Append all form fields to the FormData object
    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData.image) {
        formDataToSend.append("image", formData.image); // Append single image
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append("shopId", shopId);

    try {
      // Send a POST request using Axios
      const response = await axios.post(
        "http://localhost:8000/api/product/addProduct",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 201) {
        console.log("Form Submitted:", response.data);
        alert(response.data.message)
        // Handle success (e.g., display a success message, redirect, etc.)
      } else {
        console.error("Form submission failed with status:", response.status);
        // Handle failure (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response.data.message)
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="form-container">
      <h1>Add Equipment</h1>
      <form id="addEquipmentForm" onSubmit={handleSubmit}>
        <h3>Equipment Details</h3>

        <div className="form-group">
          <label htmlFor="equipmentName">Equipment Name</label>
          <input
            type="text"
            id="equipmentName"
            name="equipmentName"
            placeholder="Enter Equipment Name"
            value={formData.equipmentName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Respiratory">Respiratory Equipment</option>
            <option value="Mobility">Mobility Equipment</option>
            <option value="Beds">Hospital Beds</option>
            <option value="Monitoring">Monitoring Devices</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter Equipment Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Available Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Enter Available Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rentalPrice">Rental Price (per day)</label>
          <input
            type="number"
            id="rentalPrice"
            name="rentalPrice"
            placeholder="Enter Rental Price"
            value={formData.rentalPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="securityDeposit">Security Deposit</label>
          <input
            type="number"
            id="securityDeposit"
            name="securityDeposit"
            placeholder="Enter Security Deposit"
            value={formData.securityDeposit}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Upload Image</h3>
        <div className="form-group">
          <label htmlFor="image">Equipment Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit">Add Equipment</button>
        </div>
      </form>

      <style>
        {`
          .form-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          h1, h3 {
            text-align: center;
            color: #333;
          }

          .form-group {
            margin-bottom: 15px;
          }

          label {
            font-weight: bold;
            color: #555;
            display: block;
            margin-bottom: 5px;
          }

          input, select, textarea {
            width: 100%;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-sizing: border-box;
            font-size: 16px;
          }

          textarea {
            resize: vertical;
            min-height: 100px;
          }

          button {
            background-color: #4caf50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #45a049;
          }

          .form-group input[type="file"] {
            padding: 5px;
          }

          .form-group input[type="file"]:hover {
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}

export default AddProduct;
