
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaDownload, FaEye, FaRupeeSign } from 'react-icons/fa'; //  Bootstrap Icons
import UserSidebar from './UserSidebar';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
function MyCheckups() {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userObjId");

  useEffect(() => {
    if (!userId || !token) {
      console.error("User not authenticated.");
      return;
    }

    axios.get(`http://localhost:8000/api/checkup/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setCheckups(res.data.checkups || []);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching checkups:", err);
      setLoading(false);
    });
  }, [userId, token]);

  const downloadFile = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  //  Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  //  Handle Payment via Razorpay
  const handlePayment = async (checkup) => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/payments/orders",
        { amount: checkup.price, orderId: checkup._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_PqciCl4tNBqXRv", // Replace with your Razorpay Key
        amount: checkup.price * 100,
        currency: "INR",
        name: "Lab Checkup Payment",
        description: `Payment for Checkup #${checkup._id}`,
        order_id: response.data.orderId,
        handler: async (paymentResponse) => {
          alert("Payment successful!");
          generateInvoice(checkup);
          console.log("Payment Details:", paymentResponse);

          //  Update payment status in backend
          try {
            await axios.put(
              `http://localhost:8000/api/checkup/update-payment/${checkup._id}`,
              { isPaid: true },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            //  Update checkup status locally
            setCheckups((prevCheckups) =>
              prevCheckups.map((c) =>
                c._id === checkup._id ? { ...c, isPaid: true } : c
              )
            );
          } catch (error) {
            console.error("Error updating payment status:", error);
          }
        },
        prefill: {
          email: "user@example.com",
          contact: "9999999999", // Change to user's phone
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed.");
    }
  };
  const generateInvoice = (checkup) => {
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("INVOICE", 80, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 150, 30);
    doc.text(`Invoice ID: ${checkup._id}`, 20, 40);
    doc.text(`Lab Name: ${checkup.lab?.labName || "N/A"}`, 20, 50);
    doc.text(`Patient Name: ${checkup.user?.name || "N/A"}`, 20, 60);
    
    doc.setFontSize(14);
    doc.text("Order Details:", 20, 80);
    
    doc.setFontSize(12);
    doc.text(`Service: Lab Checkup`, 20, 90);
    doc.text(`Amount: ₹${checkup.price || "N/A"}`, 20, 100);
    doc.text(`Payment Status: Completed`, 20, 110);
    
    doc.line(20, 130, 190, 130);
    doc.text("Thank you!", 90, 150);
    
    doc.save(`Invoice_${checkup._id}.pdf`);
};

  return (
    <div className="d-flex">
      <UserSidebar />
      <Container className="mt-4" style={{ marginLeft: '300px' }}>
        <h2 className="mb-4 text-primary">📋 My Checkups</h2>
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive className="shadow">
            <thead className="bg-primary text-white text-center">
              <tr>
                <th>Lab Name</th>
                <th>Date</th>
                <th>Prescription</th>
                <th>Status</th>
                <th>Result</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {checkups.length > 0 ? (
                checkups.slice().reverse().map((checkup) => (
                  <tr key={checkup._id} className="text-center">
                    <td>{checkup.lab.labName || 'N/A'}</td>
                    <td>{new Date(checkup.createdAt).toLocaleDateString()}</td>
                    <td>
                      {checkup.prescription ? (
                        <OverlayTrigger overlay={<Tooltip>View Prescription</Tooltip>}>
                          <a
                            href={`http://localhost:8000${checkup.prescription}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            <FaEye size={18} />
                          </a>
                        </OverlayTrigger>
                      ) : (
                        <span className="text-secondary">No Prescription</span>
                      )}
                    </td>
                    <td className="fw-bold">{checkup.status}</td>
                    <td>
                      {checkup.result ? (
                        <div className="d-flex justify-content-center gap-3">
                          <OverlayTrigger overlay={<Tooltip>View Result</Tooltip>}>
                            <a
                              href={`http://localhost:8000${checkup.result}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-info"
                            >
                              <FaEye size={18} />
                            </a>
                          </OverlayTrigger>

                          <OverlayTrigger overlay={<Tooltip>Download Result</Tooltip>}>
                            <Button variant="link" className="p-0 text-success" onClick={() => downloadFile(`http://localhost:8000${checkup.result}`)}>
                              <FaDownload size={18} />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      ) : (
                        <span className="text-secondary">{checkup.status}</span>
                      )}
                    </td>
                    <td>
                      {checkup.isPaid ? (
                        <span className="text-success fw-bold">Paided</span>
                      ) : checkup.paymentLink ? (
                        <Button variant="warning" onClick={() => handlePayment(checkup)}>
                          <FaRupeeSign size={16} className="me-2" />
                          Pay Now ₹{checkup.price}
                        </Button>
                      ) : (
                        <span className="text-danger">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-secondary">
                    No checkups found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
}

export default MyCheckups;
