const mongoose = require("mongoose");
//Create schema
const userInfoSchema = mongoose.Schema(
  {
    real_name: { type: String, default: "" },
    gender: { type: String, enum:["male", "female", "other", ""], default: "" },
    birthday: { type: String, default: "" },
    organization: { type: String, default: "" },
    position: { type: String, default: "" },
    avatar: { type: String, default: "" },
    location: { type: String, default: "" },
    experiences: [{ type: String, default: "" }],
  },
  {
    timestamps: true,
  }
);
//Create and export model
const UserInfo = mongoose.model("UserInfo", userInfoSchema);
module.exports = UserInfo;