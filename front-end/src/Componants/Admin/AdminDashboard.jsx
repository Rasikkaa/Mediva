
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AdminViewDoctor from "./AdminViewDoctor";
import ViewLabStaff from "./ViewLabStaff";
import AddDoctor from "./AddDoctor";
import EditDoctor from "./EditDoctor";
import AddRentalStaff from "./AddRentalStaff";
import AdminViewRentalStaff from "./AdminViewRentalstaff";
import EditRentalStaff from "./EditRentalStaff";
import AddLaboratoryStaff from "./AddLaboratoryStaff";
import EditLabStaff from "./EditLabStaff";
import AdminViewCompanion from "./AdminViewCompanion";
import AddCompanion from "./AddCompanion";
import { FaBox, FaFlask, FaUserFriends, FaUserMd, FaUsers } from "react-icons/fa";
import EditCompanion from "./EditCompanion";

function AdminDashboard() {
  const [view, setView] = useState('dashboard');
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [editRentalStaffId, setRentalStaffId] = useState(null);
  const [editStaffId, setStaffId] = useState(null);
  const [counts, setCounts] = useState({ product: 0, rentalStaff: 0, user: 0, doctors: 0, companions: 0 ,labStaff:0});
  const [editCompanionId, setEditCompanionId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/auth/counts")
      .then(response => {
        console.log(response);
        
        setCounts(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching counts:", error);
      });
  }, []);

  // const handleViewChange = (newView, id = null) => {
  //   setView(newView);
  //   if (newView === 'editDoctor') {
  //     setEditDoctorId(id);
  //     setRentalStaffId(null);
  //   } else if (newView === 'editRentalstaff') {
  //     setRentalStaffId(id);
  //     setEditDoctorId(null);
  //   } else if (newView === 'editLabstaff') {
  //     setStaffId(id);
  //   } else {
  //     setEditDoctorId(null);
  //     setRentalStaffId(null);
  //   }
  // };
  const handleViewChange = (newView, id = null) => {
    setView(newView);
    if (newView === 'editDoctor') {
      setEditDoctorId(id);
      setRentalStaffId(null);
      setEditCompanionId(null);
    } else if (newView === 'editRentalstaff') {
      setRentalStaffId(id);
      setEditDoctorId(null);
      setEditCompanionId(null);
    } else if (newView === 'editLabstaff') {
      setStaffId(id);
      setEditCompanionId(null);
    } else if (newView === 'editCompanion') {
      setEditCompanionId(id);
      setEditDoctorId(null);
      setRentalStaffId(null);
      setStaffId(null);
    } else {
      setEditDoctorId(null);
      setRentalStaffId(null);
      setEditCompanionId(null);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate("/", { replace: true });
  };

  return (
    <div className="admindashboard">
      <style>{`
        .dashboard-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          text-align: center;
        }
      `}</style>

      <Navbar bg="light" expand="lg" className="adminnavbar" style={{position:'fixed'}}>
        <Container>
          <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            
              <Nav.Link onClick={handleLogout}>
                <Button variant="outline-danger">Log Out</Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          <Col xs={3} md={2} className="adminsidebar bg-light sidebar-fixed">
            <Nav className="flex-column mt-5">
              <Nav.Link onClick={() => handleViewChange('dashboard')}>Dashboard</Nav.Link>
              <Nav.Link onClick={() => handleViewChange('viewRentalStaff')}>Rental Staff</Nav.Link>
              <Nav.Link onClick={() => handleViewChange('viewDoctor')}>Doctors</Nav.Link>
              <Nav.Link onClick={() => handleViewChange('viewLabStaff')}>Lab Staff</Nav.Link>
              <Nav.Link onClick={() => handleViewChange('viewCompanion')}>Companions</Nav.Link>
            </Nav>
          </Col>

          <Col xs={9} md={10} className="adminmain-content mt-5">
            {view === 'dashboard' && (
              <div className="mt-4">
                <h2>Welcome to the Admin Dashboard</h2>
                <Row>
                  <Col md={4}><div className="dashboard-card"><h5><FaBox /> Total Products</h5><p>{counts.product}</p></div></Col>
                  <Col md={4}><div className="dashboard-card"><h5><FaFlask /> Labstaff</h5><p>{counts.labStaff}</p></div></Col>
                  <Col md={4}><div className="dashboard-card"><h5><FaUsers /> Users</h5><p>{counts.user}</p></div></Col>
                  <Col md={4}><div className="dashboard-card"><h5><FaUserMd /> Doctors</h5><p>{counts.doctors}</p></div></Col>
                  <Col md={4}><div className="dashboard-card"><h5><FaUserFriends /> Companion</h5><p>{counts.companions}</p></div></Col>
                </Row>
              </div>
            )}

            {view === 'viewDoctor' && <AdminViewDoctor onEditDoctor={(id) => handleViewChange('editDoctor', id)} onAddDoctor={() => handleViewChange('addDoctor')} />}
            {view === 'addDoctor' && <AddDoctor />}
            {view === 'editDoctor' && <EditDoctor doctorId={editDoctorId} />}

            {view === 'viewRentalStaff' && <AdminViewRentalStaff onEditRentalStaff={(id) => handleViewChange('editRentalstaff', id)} onAddRentalStaff={() => handleViewChange('addRentalShop')} />}
            {view === 'addRentalShop' && <AddRentalStaff />}
            {view === 'editRentalstaff' && <EditRentalStaff shopId={editRentalStaffId} />}

            {view === 'viewLabStaff' && <ViewLabStaff onEditLabStaff={(id) => handleViewChange('editLabstaff', id)} onAddlabStaff={() => handleViewChange('addlaboratorystaff')} />}
            {view === 'addlaboratorystaff' && <AddLaboratoryStaff />}
            {view === 'editLabstaff' && <EditLabStaff staffId={editStaffId} />}

            {view === 'viewCompanion' && (
  <AdminViewCompanion 
    onAddCompanion={() => handleViewChange('addCompanion')} 
    onEditCompanion={(id) => handleViewChange('editCompanion', id)} 
  />
)}
{view === 'editCompanion' && <EditCompanion companionId={editCompanionId} />}

            {view === 'addCompanion' && <AddCompanion />}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;