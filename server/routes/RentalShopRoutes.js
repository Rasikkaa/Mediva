import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';
import { deleteRentalShop, getAllShop, getShopBookings, getShopCounts, getShopHome, registerShop, updateRentalShop } from '../controllers/shopController.js';

const router = express.Router();

router.post('/register', authenticateToken, registerShop);
router.get('/:shopId',authenticateToken, getShopHome);
router.get('/bookings/:shopId',authenticateToken,getShopBookings)
router.get('/',authenticateToken,getAllShop)
router.put('/:shopId',authenticateToken,updateRentalShop)
router.delete('/:shopId',authenticateToken,deleteRentalShop)
router.get('/:shopId/counts', getShopCounts);
export default router;
