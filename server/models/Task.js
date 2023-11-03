const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, default: ""},
    status: { type: String, enum:["pending","started","finished"], default: "pending"},
    plan:{
      start: { type: Date },
      expiry: { type: Date },
    },
    reality:{
      start: { type: Date },
      finish: { type: Date },
    },
    description: { type: String, default: "" },
    parent_task: { type: mongoose.SchemaTypes.ObjectId, ref: "Task" },
    users: {
      owners: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true }],
      managers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
      members: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    },
    color: { type: mongoose.SchemaTypes.ObjectId, ref: "Color", required: true },
    active: {type: Boolean, required: true},
    member_add_member:{type:Boolean, default: false}
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;