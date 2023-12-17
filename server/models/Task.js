const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, default: ""},
    status: { type: String, enum:["todo","processing","done"], default: "todo"},
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
    team:[{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    color: { type: mongoose.SchemaTypes.ObjectId, ref: "Color", required: true },
    active: {type: Boolean, required: true},
    order: {type: Number, default:0},
    member_add_member:{type:Boolean, default: true},
    access_locked:{type:Boolean, default: false},//owner can change
    edit_locked:{type:Boolean, default: false},//manager and ower can change
  },
  {
    timestamps: true,
  }
);
//Create and export model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;