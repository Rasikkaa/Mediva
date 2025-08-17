import Booking from "../models/Booking.js";
import productData from "../models/Products.js";

// Handle product booking
export const bookProduct = async (req, res) => {
  try {
    const { userId, productId, paymentId,address,phoneNumber } = req.body;

    // Find the product
    const product = await productData.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    
    // Create a new booking
    const newBooking = new Booking({
      userId,
      productId, paymentId,address,phoneNumber,
      status: "booked",
    });

    await newBooking.save();

    // Decrease the quantity of the product
    product.quantity -= 1;
    await product.save();

    return res.status(201).json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    console.error("Error booking product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// get user bookings 
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate("productId");
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Restore the product quantity
    const product = await productData.findById(booking.productId);
    if (product) {
      product.quantity += 1;
      await product.save();
    }
    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);
    return res.status(200).json({ message: "Booking canceled successfully." });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



export const returnBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
console.log(bookingId);

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Ensure the booking is eligible for return
    if (booking.status !== "booked") {
      return res.status(400).json({ message: "Booking cannot be returned." });
    }

    // Restore the product quantity
    const product = await productData.findById(booking.productId);
    console.log('ppppp',product);
    
    if (product) {
      product.quantity += 1;
      await product.save();
    }

    // Update booking status to "returned"
    booking.status = "returned";
    await booking.save();

    return res.status(200).json({ message: "Product returned successfully.", booking });
  } catch (error) {
    console.error("Error returning product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};