import express from "express";
import { createCheckupPaymentLink, createCompanionPaymentLink, createOrder, createPaymentLink, getPaymentDetails } from "../controllers/paymentController.js";

const router = express.Router();

// Route for creating an order
router.post("/orders", createOrder);
router.post('/createLink',createPaymentLink)
router.post('/checkupLink',createCheckupPaymentLink)
// Route for fetching payment details
router.get("/payment/:paymentId", getPaymentDetails);
router.post('/compnionpayment',createCompanionPaymentLink)

export default router;
