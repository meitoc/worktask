const mongoose = require("mongoose");

//Create schema
const accessSchema = mongoose.Schema(
  {
    email_otp: { type: String, unique: true},
    email_otp_status: { type: Boolean, default:true},
    session: { type: String, required: true , unique: true},
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", unique: true },
    tried_time: { type: Number, enum:[0,1,2,3], default:0 },
    active: { type: Boolean, default: true},
    locked_to: { type: Date},
  },
  {
    timestamps: true,
  }
);

//Create and export model
const Access = mongoose.model("Access", accessSchema);
module.exports = Access;