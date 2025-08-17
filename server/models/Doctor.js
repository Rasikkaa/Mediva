import mongoose, { Schema } from "mongoose";
import { type } from "os";

// Doctor Schema
const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  commonKey:{
    type: Schema.Types.ObjectId,
    ref: "Login",
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  hospitalName:{
    type: String,
  },
  email: {
    type: String,
    required: true,
  
  },
  contact: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  workingHours: {
    type: String,
    required: true,
  },
  image: {
    type: String, // This will store the file path for the uploaded image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  totalAppointments:{
    type:Number
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
