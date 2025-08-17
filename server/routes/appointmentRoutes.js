import express from 'express';
import { cancelAppointment, createAppointment, getAppointments, getAvailableTokens, getDoctorAppointments, updateAppointmentStatus } from '../controllers/appoinmentController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post('/book', authenticateToken, createAppointment);
router.post("/available-tokens",authenticateToken,getAvailableTokens);
router.get('/user/:userId', authenticateToken, getAppointments);
router.get('/:doctorId', authenticateToken, getDoctorAppointments);
router.put('/:appointmentId',authenticateToken,updateAppointmentStatus)
router.delete("/cancel/:appointmentId",authenticateToken, cancelAppointment);
export default router;
