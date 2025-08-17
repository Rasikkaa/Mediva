import mongoose from "mongoose";
import { Schema } from "mongoose";

const shopSchema = new Schema({
    shopName: { type: String, required: true },
    commonKey:{
        type: Schema.Types.ObjectId,
        ref: "Login",
      },
    email:{type: String, required: true, unique: true },
    phone:{type:Number},
    address:{type:String}
  });


 const shopData = mongoose.model("Shop",shopSchema) 
 export default shopData