const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const {JWT_SECRET_SESSION_KEY,JWT_SECRET_FIRST_KEY} = process.env;

//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    role: { type: String, enum:["manager","user"], required: true },
    email:{ type: String },
    new_email:{ type: String },
    phone:{ type: String },
    active: { type: Boolean, required: true },
    information: { type: mongoose.SchemaTypes.ObjectId, ref: "UserInfo", unique: true },
    password: { type: String, required: true },
    new_password: { type: String}
  },
  {
    timestamps: true,
  }
);
//JWT secure session
userSchema.methods.generateSession = async function() {
  const accessToken = await jwt.sign({_id: this._id}, JWT_SECRET_SESSION_KEY, {expiresIn: '1d'});
  return accessToken;
}
//JWT secure firt login string
userSchema.methods.generateFirst = async function() {
  const accessToken = await jwt.sign({_id: this._id, email: this.email_otp}, JWT_SECRET_FIRST_KEY);
  return accessToken;
}
//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;