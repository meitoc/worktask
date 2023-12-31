const mongoose = require("mongoose");
//Create schema
const taskNotifySchema = mongoose.Schema(
  {
    task: { type: mongoose.SchemaTypes.ObjectId, ref: "Task" },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User",required: true },
    sendTo: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    readBy: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    action: { type: String, enum:["add", "change", "delete"], default: "change" },
    item: { type: String, enum:["comment", "owner", "manager", "member", "file","status","child order"]},
    itemComment: { type: mongoose.SchemaTypes.ObjectId, ref: "Comment" },
    itemOwner: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    itemManager: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    itemMember: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    itemFile: { type: mongoose.SchemaTypes.ObjectId, ref: "File" },
    itemStatus: { type: String, enum: ["todo","processing", "done"] },
  },
  {
    timestamps: true,
  }
);
//Create and export model
const TaskNotify = mongoose.model("TaskNotify", taskNotifySchema);
module.exports = TaskNotify;