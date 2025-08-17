import express from 'express';

import authenticateToken from '../middlewares/authenticateToken.js';
// import checkRole from '../middlewares/checkRole.js';
import {upload} from '../utils/multer.js';
import { addDoctor, deleteDoctor, getDoctorById, getDoctorHome, getDoctors, updateDoctor } from '../controllers/doctorcontroller.js';
const router = express.Router();

router.post('/addDoctor', authenticateToken, upload.single('image'), addDoctor);
router.get('/', authenticateToken, getDoctors);
router.get('/doctorhome/:id', authenticateToken, getDoctorHome); 
router.get('/:id', authenticateToken, getDoctorById);
router.put('/editdoctors/:id', authenticateToken, upload.single('image'), updateDoctor); // New route for editing a doctor
router.delete('/:id',authenticateToken, deleteDoctor);
export default router;



