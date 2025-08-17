import mongoose from "mongoose";

// Define the schema for an appointment
const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // Reference to the Doctor model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    tokenNumber: { type: Number, required: true },
    status: {
      type: String,
      // enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Create the Appointment model
const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
