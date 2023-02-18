const { model, Schema } = require("mongoose");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema
// Definig User Data
const user = new Schema(
    {
      name : {
        type : String
      },
      email : {
        type : String
      },
      password : {
        type : String
      },
      dob:{
        type : Date
      },
      gender :{
        type : String
      },
      orders :{
        type : Array
      },
      interests:{
        type : Array
      },
      address:{
      type:String    
      },
      pincode:{
        type:Number
      }
    },
    {timestamps:true}
    ,
    
);



const User = mongoose.model("User",user);
module.exports = User;
