import express from "express";

import { allOrders, createOrder, getUserOrders, updateOrderStatus, updatePaymentStatus } from "../controllers/orderController.js";
import { upload } from "../utils/multer.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

// Routes
router.post("/", authenticateToken, upload.single("image"), createOrder);
router.get("/user/:userId", authenticateToken, getUserOrders);
router.get('/allorders',authenticateToken,allOrders)
router.put("/:id", authenticateToken,updateOrderStatus);
router.put('/payment/:id',authenticateToken,updatePaymentStatus)

export default router;
