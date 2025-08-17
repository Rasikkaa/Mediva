import mongoose, { Schema } from 'mongoose';

const checkupSchema = new Schema(
  {
    lab: {
      type: Schema.Types.ObjectId,
      ref: 'LabStaff',  // Referencing the LabStaff model
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Assuming you have a 'User' model for the users submitting checkups
      required: true,
    },
    prescription: {
      type: String,  // Stores the path to the uploaded prescription file
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    result: {
      type: String,  // Stores the path to the result file once available
      default: null,
    },
    address:{type:String},
    phone:{type:String},
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Checkup', checkupSchema);
