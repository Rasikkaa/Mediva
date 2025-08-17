import express from 'express'
import { allCompanion, deleteCompanion, getCompanionById, getCompanionhome, registerCompanion, updateCompanion } from '../controllers/companionController.js'
import { upload } from '../utils/multer.js';
import authenticateToken from '../middlewares/authenticateToken.js';


const router = express.Router()

router.post('/',upload.single('image'), registerCompanion)
router.get('/allcompanion',allCompanion)
router.delete("/delete/:id", deleteCompanion);
router.get("/:id", getCompanionById);
router.get('/home/:id',getCompanionhome)
router.put("/update/:id", updateCompanion);
export default router;
