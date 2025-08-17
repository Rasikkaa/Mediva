
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabSidebar from "./LabSidebar";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap"; // Import React-Bootstrap components
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap styles are imported

function CheckUps() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentLinks, setPaymentLinks] = useState({});
  const [showModal, setShowModal] = useState(false); // Controls Modal Visibility
  const labobjId = localStorage.getItem("labobjId");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!labobjId || !authToken) {
      navigate("/"); // Redirect to login if missing credentials
      return;
    }
    fetchBookings();
  }, [labobjId, authToken, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/checkup/lab/${labobjId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("Bookings Data:", response.data);
      setBookings(response.data.checkups);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const updateStatus = async (checkupId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/checkup/${checkupId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFileUpload = async (checkupId, file) => {
    const formData = new FormData();
    formData.append("result", file);

    setUploading(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/checkup/${checkupId}/result`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Result uploaded successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error uploading result:", error);
    } finally {
      setUploading(false);
    }
  };

  // Open payment modal
  const openPaymentModal = (checkup) => {
    setSelectedCheckup(checkup);
    setAmount("");
    setShowModal(true);
  };

  // Generate Payment Link
  const generatePaymentLink = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/payments/checkupLink",
        { checkupId: selectedCheckup._id, amount },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success) {
        setPaymentLinks((prev) => ({
          ...prev,
          [selectedCheckup._id]: response.data.paymentLink,
        }));
        alert(`Payment link generated: ${response.data.paymentLink}`);
        fetchBookings()
        setShowModal(false); // Close the modal after success
      } else {
        alert("Failed to generate payment link.");
      }
    } catch (error) {
      console.error("Error generating payment link:", error);
      alert("Payment link generation failed.");
    }
  };

  return (
    <div >
      <LabSidebar />
      <div style={{  padding: "20px", width: "100%" }}>
        <h2>CheckUps & Bookings</h2>
        {bookings.length > 0 ? (
          <table border="1" width="100%" cellPadding="10">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>phone</th>
                <th>Address</th>
                <th>Prescription</th>
                <th>Update Status</th>
                <th>Upload Result</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice().reverse().map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user?.name || "N/A"}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.address}</td>
                  <td>
                    {booking.prescription ? (
                      <a
                        href={`http://localhost:8000${booking.prescription}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Prescription
                      </a>
                    ) : (
                      "No Prescription"
                    )}
                  </td>
                  <td>
                    <select value={booking.status} onChange={(e) => updateStatus(booking._id, e.target.value)}
                      disabled={booking.status === "Completed"}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed" disabled>
                        Completed
                      </option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(booking._id, e.target.files[0])}
                      disabled={uploading || booking.status === "Completed"}
                    />
                  </td>
                  <td>
  {booking.isPaid ? (
    <p className="btn btn-success btn-sm">Completed</p>
  ) : booking.paymentLink? (
    <p className="btn btn-secondary btn-sm">Generated...</p>
  ) : (
    <button className="btn btn-primary btn-sm" onClick={() => openPaymentModal(booking)}>
      Generate Payment Link
    </button>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings available.</p>
        )}
      </div>

      {/* React-Bootstrap Modal for Payment */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Payment Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={generatePaymentLink}>
            Generate Link
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CheckUps;
