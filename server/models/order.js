
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderText: String,
    imageUrl: String,
    status: {
      type: String,
      enum: ["Pending","processing", "Out for Delivery", "Delivered"], 
      default: "Pending",
    },
    address:{
      type:String},
      phone:{type:String},  
    paymentLink: {
      type: String, // Store the payment link
      default: null,
    },
    price:{
      type:String,
    },
    isPaid: {
      type: Boolean, // Check if payment is done
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
