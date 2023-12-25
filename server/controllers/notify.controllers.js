const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const TaskNotify = require("../models/TaskNotify.js")
// const Task = require("../models/Task.js")

const notifyController={}

//Get a notify
notifyController.getNotify=async(req,res,next)=>{
    try{
        const {userId} = req.access;
        const limit = req.params.limit??10;
        const filter = {sendTo:userId}
        const listOfFound= await TaskNotify.find(filter)
        .populate("user", "name active -_id -__v")
        .populate("sendTo", "name active -_id -__v")
        .populate("readBy", "name active -_id -__v")
        .populate("itemOwner", "name active -_id -__v")
        .populate("itemMember", "name active -_id -__v")
        .sort({timestamp:-1})
        .limit(limit);
        sendResponse(res,200,true,listOfFound,null,"Found list of notifys success")
    }catch(err){
        next(err)
    }
}
notifyController.addNotify=async(req,res,next)=>{
    try{
        const {task,user,sendTo,readBy,action,item,itemComment,itemOwner,itemMember,itemFile,itemStatus} = req.notify;
        const notify ={task,user,sendTo,readBy,action,item,itemComment,itemOwner,itemMember,itemFile,itemStatus};
        await TaskNotify.create(notify)
        next();
    }catch(err){
        next(err)
    }
}
//export
module.exports = notifyController