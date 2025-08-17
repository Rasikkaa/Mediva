
import mongoose, { Schema } from "mongoose";

const CompanionSchema = new Schema({
    commonKey:{
        type: Schema.Types.ObjectId,
        ref: "Login",
      },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  experience: { type: String, required: true },
  gender:{type:String},
  image:{type:String},
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
});

CompanionSchema.index({ location: "2dsphere" });

export default mongoose.model('Companion', CompanionSchema);
