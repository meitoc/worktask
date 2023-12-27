const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const TaskNotify = require("../models/TaskNotify.js")
// const Task = require("../models/Task.js")

const notifyController={}

//Get a notify
notifyController.getNotify=async(req,res,next)=>{
    try{
        const {userId} = req.access;
        const limit = req.params.limit??100;
        const filter = {sendTo:userId}
        const listOfFound= await TaskNotify.find(filter)
        .populate("user", "name active -_id")
        .populate("sendTo", "name active -_id")
        .populate("readBy", "name active -_id")
        .populate("itemOwner", "name active -_id")
        .populate("itemMember", "name active -_id")
        .sort({createdAt:-1})
        .limit(limit);
        if(listOfFound)
        sendResponse(res,200,true,listOfFound,null,"Found list of notifys success")
    }catch(err){
        next(err)
    }
}
notifyController.addNotify=async(req)=>{
    try{
        const {task,user,sendTo,readBy,action,item,itemComment,itemOwner,itemMember,itemFile,itemStatus} = req.notify;
        const notify ={}
        if(task) notify.task=task;
        if(user) notify.user=user;
        if(sendTo) notify.sendTo=sendTo;
        if(readBy) notify.readBy=readBy;
        if(action) notify.action=action;
        if(item) notify.item=item;
        if(itemComment) notify.itemComment=itemComment;
        if(itemOwner) notify.itemOwner=itemOwner;
        if(itemMember) notify.itemMember=itemMember;
        if(itemFile) notify.itemFile=itemFile;
        if(itemStatus) notify.itemStatus=itemStatus;
        console.log("UUUUUUUUUUUU",notify)
        const result = await TaskNotify.create(notify)
        if(result) console.log(result)
        else console.log("FALI")
        return true
    }catch(err){
        return true
    }
}
//export
module.exports = notifyController