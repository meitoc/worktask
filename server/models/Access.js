const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const {JWT_SECRET_SESSION_KEY} = process.env;

//Create schema
const accessSchema = mongoose.Schema(
  {
    email_otp: { type: String, unique: true},
    email_otp_status: { type: Boolean, default:true},
    session: { type: String, required: true , unique: true},
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", unique: true },
    role: { type: String, enum:["manager","user"], required: true, default:"user" },
    tried_time: { type: Number, enum:[0,1,2,3], default:0 },
    active: { type: Boolean, default: true},
    locked_from: { type: Date},
  },
  {
    timestamps: true,
  }
);
//create logout session, only 1s period for secure
accessSchema.methods.generateLogoutSession = async function() {
  const accessToken = await jwt.sign({_id: this.user}, JWT_SECRET_SESSION_KEY, {expiresIn: '1s'});
  return accessToken;
}
//check validation
accessSchema.methods.isValidSession = async function (accessToken) {
  try {
    const decoded = await jwt.verify(accessToken, JWT_SECRET_SESSION_KEY);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log('Token has expired.');
      return false;
    }
    if (decoded._id===this.user.toString()) return this.role;
  } catch (error) {
    console.error('Invalid Token');
    return false;
  }
};
//Create and export model
const Access = mongoose.model("Access", accessSchema);
module.exports = Access;