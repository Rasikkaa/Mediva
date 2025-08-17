import mongoose, { Schema } from "mongoose";

const labStaffSchema = new Schema({
  labName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  commonKey:{
    type: Schema.Types.ObjectId,
    ref: "Login",
  },
}, { timestamps: true });

export default mongoose.model("LabStaff", labStaffSchema);
