import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewLabStaff = ({ onAddlabStaff,onEditLabStaff }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchLabStaff();
  }, []);

  // Fetch Lab Staff Data from API
  const fetchLabStaff = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/laboratory-staff",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);

      setStaff(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`http://localhost:8000/api/laboratory-staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(staff.filter((member) => member._id !== id)); // Remove from UI
      } catch (error) {
        alert("Error deleting staff: " + error.message);
      }
    }
  };

  // Handle Edit
  const handleEdit = (staffId) => {
    onEditLabStaff(staffId); // Trigger edit mode
  };

  // Handle Add New
  const handleAddNew = () => {
    onAddlabStaff(); // Open form for new entry
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lab Staff List</h2>
        <button className="btn btn-primary" onClick={handleAddNew}>
          Add New +
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length > 0 ? (
            staff.map((member) => (
              <tr key={member._id}>
                <td>{member.labName}</td>
                <td>{member.email}</td>
                <td>{member.address}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(member._id)}
                  >
                    <i className="fas fa-edit"></i>Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(member._id)}
                  >
                   <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No staff found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewLabStaff;
