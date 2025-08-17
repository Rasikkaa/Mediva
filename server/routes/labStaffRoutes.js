import express from "express";
import { addLabStaff, deleteLabStaffById, getAllLabStaff, getLabStaffById, getLabStaffHome, updateLabStaffById } from "../controllers/labStaffController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/", addLabStaff); // Add Lab Staff
router.get("/", getAllLabStaff); // Get all Lab Staff
router.get("/lab-staff/:logId",authenticateToken,getLabStaffHome)
// Get a single lab staff by ID
router.get("/:id", getLabStaffById);
router.delete("/:id",authenticateToken,deleteLabStaffById)
// Update lab staff by ID
router.put("/:id",authenticateToken, updateLabStaffById);

export default router;
