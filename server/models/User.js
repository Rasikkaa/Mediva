import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    commonKey:{
        type: Schema.Types.ObjectId,
        ref: "Login",
      },
    email: { type: String, required: true, unique: true },
    phone:{type:String},
    address:{type:String},
    photo:{type:String}
  });

 const userData = mongoose.model("User",userSchema) 
 export default userData