import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';
import {upload, uploadMultipleImages} from '../utils/multer.js';
import { addProduct, deleteProduct, getProducts, getProductsByShop, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/addProduct', authenticateToken,  upload.single('image'), addProduct);
router.get('/shopview/:shopId',authenticateToken,getProductsByShop)
router.get('/',authenticateToken,getProducts)
router.put('/editproduct/:id',authenticateToken, upload.single('image'),updateProduct)
router.delete('/:id', deleteProduct);
export default router;
 