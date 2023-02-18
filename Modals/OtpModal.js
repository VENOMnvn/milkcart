const { model, Schema } = require("mongoose");
const mongoose = require('mongoose');

// Schema
// Definig User Data
const otpSchema = new Schema(
    {
      email:{
        type : String,
      },
      otp:{
        type : Number
      },
      expireAt : {
        type : Date
      }
    },
    {timestamps:true}
);

const OtpModal = mongoose.model("Otp",otpSchema);
module.exports = OtpModal;
