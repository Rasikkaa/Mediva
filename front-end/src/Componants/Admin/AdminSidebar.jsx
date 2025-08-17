import React from "react";
import { Nav } from "react-bootstrap";

const AdminSidebar = ({ onViewChange }) => {
  return (
    <div className="adminsidebar bg-light sidebar-fixed">
      <Nav className="flex-column mt-5">
        <Nav.Link onClick={() => onViewChange("dashboard")}>Dashboard</Nav.Link>
        <Nav.Link onClick={() => onViewChange("addDoctor")}>Add Doctors</Nav.Link>
        <Nav.Link onClick={() => onViewChange("addRentalShop")}>Add Rental Shop</Nav.Link>
        <Nav.Link onClick={() => onViewChange("viewRentalStaff")}>View Rental Staff</Nav.Link>
        <Nav.Link onClick={() => onViewChange("viewDoctor")}>View Doctors</Nav.Link>
        <Nav.Link onClick={() => onViewChange("addlaboratorystaff")}>Add Lab Staff</Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
