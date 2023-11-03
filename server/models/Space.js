const mongoose = require("mongoose");
//Create schema
const spaceSchema = mongoose.Schema(
  {
    name: { type: String, required: true , default:""},
    description: { type: String, default: "" },
    tasks: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    color: { type: mongoose.SchemaTypes.ObjectId, ref: "Color", required: true }
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Space = mongoose.model("Space", spaceSchema);
module.exports = Space;