const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  __id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /[a-f]*/,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: /\S+@\S+\.\S+/,
  },
  password: { type: String, required: true, minlength: 6 },
  OTP:{type:String},
  otpExpire:Date,
  isVerified:{type:Boolean,default:false},
});

module.exports = mongoose.model("User", userSchema);
