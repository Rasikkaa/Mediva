import mongoose, { Schema } from "mongoose";

const loginScheema =new Schema({
   
    userName:{
        type:String,
        required:true

    },
    passWord:{
        type:String,
        required:true
    },
    role:{
        type:String,
    },
  
})
const loginData = mongoose.model("Login",loginScheema) 
export default loginData