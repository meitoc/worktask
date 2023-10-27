const mongoose = require("mongoose");
//Create schema
const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    task: { type: mongoose.SchemaTypes.ObjectId, ref: "Task" },
    comment: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;