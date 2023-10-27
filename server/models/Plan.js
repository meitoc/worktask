const mongoose = require("mongoose");
//Create schema
const planSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
    price: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        enum: ["USD","VND"],
        required: true
      }
    },
    duration: { type: Number, enum:[1,7,30,60,90,365,730], required: true },
    permissions:[{
      name: { type: String, required: true },
      value: { type: String, default: "" },
      number: {type: Number, default: 0 }
    }],
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;