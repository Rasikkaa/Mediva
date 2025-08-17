import Razorpay from "razorpay";
import order from "../models/order.js";
import CheckUp from "../models/CheckUp.js";
import CompanionBooking from "../models/CompanionBooking.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_PqciCl4tNBqXRv',
  key_secret: 'DVcqIq0o9YiiHQLhy0y832RR',
});

// Create Order
export const createOrder = async (req, res) => {
  const { amount, currency } = req.body;
console.log(req.body);

  const options = {
    amount: amount * 100, // Convert amount to paise
    currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
      
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Error creating Razorpay order", error });
  }
};

// Fetch Payment Details
export const getPaymentDetails = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({
      success: true,
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
      
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch payment details", error });
  }
};
//  Create Payment Link & Set Price (Delivery Boy Action)
export const createPaymentLink = async (req, res) => {
    const { orderId, amount } = req.body;
  
    if (!orderId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order or amount." });
    }
  
    try {
      const orderdata = await order.findById(orderId);
      if (!orderdata) return res.status(404).json({ success: false, message: "Order not found." });
  
      //  Check if price is already set (prevent multiple price updates)
    //   if (orderdata.price !== null) {
    //     return res.status(400).json({ success: false, message: "Price is already set for this order." });
    //   }
  
      //  Generate Razorpay Payment Link
      const paymentLink = await razorpay.paymentLink.create({
        amount: amount * 100, // Amount in paisa
        currency: "INR",
        description: `Payment for Order ID: ${orderId}`,
        customer: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9876543210",
        },
        notify: { sms: true, email: true },
        callback_url: `http://localhost:3000/payment-success?orderId=${orderId}`,
        callback_method: "get",
      });
  
      //  Update Order with Price & Payment Link
      orderdata.price = amount;
      orderdata.paymentLink = paymentLink.short_url;
      await orderdata.save();
  
      res.json({ success: true, paymentLink: paymentLink.short_url });
    } catch (error) {
      console.error("Error creating payment link:", error);
      res.status(500).json({ success: false, message: "Failed to create payment link", error });
    }
  };
  

  export const createCheckupPaymentLink = async (req, res) => {
    const { checkupId, amount } = req.body;
  
    if (!checkupId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid checkup or amount." });
    }
  
    try {
      const checkup = await CheckUp.findById(checkupId).populate('user');
      if (!checkup) return res.status(404).json({ success: false, message: "Checkup not found." });
  
      if (checkup.paymentLink) {
        return res.json({ success: true, paymentLink: checkup.paymentLink });
      }
  
      // Generate Razorpay Payment Link
      const paymentLink = await razorpay.paymentLink.create({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        description: `Payment for Checkup ID: ${checkupId}`,
        customer: {
          name: checkup.user.name,
          email: checkup.user.email,
          contact: checkup.user.phone || "0000000000",
        },
        notify: { sms: true, email: true },
        callback_url: `http://localhost:3000/payment-success?checkupId=${checkupId}`,
        callback_method: "get",
      });
  
      // Save the payment link to the checkup record
      checkup.paymentLink = paymentLink.short_url;
      checkup.price=amount;
      await checkup.save();
  
      res.json({ success: true, paymentLink: paymentLink.short_url });
    } catch (error) {
      console.error("Error creating payment link:", error);
      res.status(500).json({ success: false, message: "Failed to create payment link", error });
    }
  };



  // Generate Payment Link for Companion Booking
export const createCompanionPaymentLink = async (req, res) => {
  const { bookingId, amount } = req.body;
console.log(req.body);

  // Validate input
  if (!bookingId || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid booking or amount." });
  }

  try {
    // Fetch the companion booking details
    const booking = await CompanionBooking.findById(bookingId).populate('userId');
    if (!booking) return res.status(404).json({ success: false, message: "Companion booking not found." });

    // If payment link already exists, return it
    if (booking.paymentLink) {
      return res.json({ success: true, paymentLink: booking.paymentLink });
    }

    // Create Razorpay Payment Link
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      description: `Payment for Companion Booking ID: ${bookingId}`,
      customer: {
        name: booking.user?.name || "Unknown User",
        email: booking.user?.email || "customer@example.com",
        contact: booking.user?.phone || "3698521470",
      },
      notify: { sms: true, email: true },
      callback_url: `http://localhost:3000/payment-success?bookingId=${bookingId}`,
      callback_method: "get",
    });

    // Save the payment link to the booking record
    booking.paymentLink = paymentLink.short_url;
    booking.price = amount;
    await booking.save();

    res.json({ success: true, paymentLink: paymentLink.short_url });
  } catch (error) {
    console.error("Error creating companion payment link:", error);
    res.status(500).json({ success: false, message: "Failed to create payment link", error });
  }
};