const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true},
    size: { type: Number, required: true},
    active: {type: Boolean, required: false},
    type: { type: String, required: true},
    task: { type: mongoose.SchemaTypes.ObjectId, ref: "File"},
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);
//Create and export model
const File = mongoose.model("File", taskSchema);
module.exports = File;