const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  Code:{
    type:Number,
    default:0
  }
,
CodeExpires: Number
  
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
