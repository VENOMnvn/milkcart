const { model, Schema } = require("mongoose");
const mongoose = require('mongoose');

const admin = new Schema({

    email:{
        type:String
    },
    name:{
      type:String  
         }
});

const Admin = mongoose.model( 'Admin',admin);
module.exports = Admin;