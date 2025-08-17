// /models/Product.js
import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  equipmentName: {
    type: String,
    required: true,
  },
  shopId:{
    type:  Schema.Types.ObjectId,
    ref:'Shop'
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
 
  rentalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type:String, // Array of image URLs
    required: true,
  },
}, { timestamps: true });


 const productData= mongoose.model('Product', productSchema);
 export default productData