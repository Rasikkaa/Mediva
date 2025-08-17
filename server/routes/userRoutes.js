import express from 'express';
import { registerUser , userhome  } from '../controllers/userController.js';


import {upload} from '../utils/multer.js'; // If you have multer utility for file uploads
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post('/register', upload.single('photo'), registerUser);
router.get('/home/:id',authenticateToken, userhome);
export default router;
