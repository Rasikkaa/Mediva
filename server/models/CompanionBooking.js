import mongoose from "mongoose";

const companionBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companionId: { type: mongoose.Schema.Types.ObjectId, ref: "Companion", required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    address: { type: String },phone: { type: String },
    status: { type: String,  default: "pending" },
    paymentLink: {
        type: String, // Store the generated Razorpay payment link
        default: null,
      },
      price:{
        type:String,
      },
      isPaid: {
        type: Boolean, // Check if payment is done
        default: false,
      },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
   
}, { timestamps: true });

export default mongoose.model("CompanionBooking", companionBookingSchema);
