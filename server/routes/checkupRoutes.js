import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js'; // Token authentication middleware
import { upload } from '../utils/multer.js'; // Utility for handling file uploads
import { createCheckup, getCheckupsForLab, getCheckupsForUser, updateCheckupStatus, updatePaymentStatus, uploadResult } from '../controllers/checkupController.js';

const router = express.Router();

// Route for creating a new checkup request
router.post('/', authenticateToken, upload.single('prescription'), createCheckup);

// Route for getting all checkups for the authenticated user
router.get('/:userId', authenticateToken, getCheckupsForUser);

// Route for updating the status of a checkup (e.g., Pending, In Progress, Completed)
router.put('/:checkupId/status', authenticateToken, updateCheckupStatus);

// Route for uploading a result for a checkup (once completed by the lab)
router.post('/:checkupId/result', authenticateToken, upload.single('result'), uploadResult);

router.put('/update-payment/:checkupId',updatePaymentStatus)

router.get('/lab/:labId',authenticateToken, getCheckupsForLab);
export default router;
