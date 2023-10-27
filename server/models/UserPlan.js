const mongoose = require("mongoose");
//Create schema
const userPlanSchema = mongoose.Schema(
  {
    plan: { type: mongoose.SchemaTypes.ObjectId, ref: "Plan", required: true},
    // user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    start: { type: Date, required: true },
    expiry: { type: Date, required: true },
    paid: { type: Boolean, required: true },
    total_paid: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        enum: ["USD","VND"],
        required: true
      }
    }
  },
  {
    timestamps: true,
  }
);
//Create and export model
const UserPlan = mongoose.model("UserPlan", userPlanSchema);
module.exports = UserPlan;