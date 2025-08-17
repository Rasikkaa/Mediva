import express from "express";
import {
    createBooking,
    updateLocation,
    getCompanionLocation,
    getUserBookings,
    getCompanionBookings,
    updateBookingStatus,
    updatePaymentStatus
} from "../controllers/companionBookingController.js";
const router = express.Router();
//  Create a booking
router.post("/update-location/:companionId", updateLocation);
router.post("/create", createBooking);
router.get('/:userId',getUserBookings)
router.get('/companion/:companionId',getCompanionBookings)
router.put('/update-status/:bookingId',updateBookingStatus)

//  Update companion location

router.put('/update-payment/:bookingId',updatePaymentStatus)

router.get("/location/:bookingId", getCompanionLocation);

export default router;
