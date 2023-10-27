const mongoose = require("mongoose");
//Create schema
const colorSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    frame:{ type: String, default: "rgb(0,10,50)" },
    background:{ type: String, default: "rgb(0,100,100)" },
    text:{ type: String, default: "rgb(20,0,0)" },
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Color = mongoose.model("Color", colorSchema);
module.exports = Color;