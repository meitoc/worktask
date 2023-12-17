const mongoose = require("mongoose");
//Create schema
const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    task: { type: mongoose.SchemaTypes.ObjectId, ref: "Task" },
    comment: { type: String, required: true },
    status: {type: String, enum:["normal","hide","pin"]},
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;