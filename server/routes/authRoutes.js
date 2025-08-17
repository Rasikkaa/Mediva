import express from 'express';
import { getAdminCounts, login } from '../controllers/authcontroller.js';
// import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/counts',getAdminCounts)

export default router;
