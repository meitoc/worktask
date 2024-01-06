const { sendResponse, AppError}=require("../../helpers/utils.js")
const taskFileController={}
const File = require("../../models/File.js");
const { filterField } = require("../../tools/filterData.js");

const showField = {_id:1,user:1,name:1,size:1,createdAt:1,updatedAt:1};

//Get a file on a task
taskFileController.createFileRecord = async(req,res,next)=>{
    try{
        const taskId=req.params.id;
        const userId = req.access.userId;
        const {name, size, type } = req.body;
        if(size>10485760) return res.status(400).json({ errors: [{ msg: 'File is over 10MB!' }] });
        const data= {name, size, type, task: taskId, user:userId, active:false }
        const createdFile = await File.create(data);
        if(!createdFile) return res.status(400).json({ errors: [{ msg: 'Wrong task id!' }] });
        req.file=createdFile?._id
        next();
    }catch(err){
        next(err);
    }
}
taskFileController.responsePresignedUrl = async(req,res,next)=>{
    try{
        sendResponse(res,200,true,{url:req.result,_id:req.file},null,"Create URL Success")
    }catch(err){
        next(err);
    }
}
taskFileController.responseFileList = async(req,res,next)=>{
    try{
        const taskId=req.params.id;
        const foundFiles = await File.find({task:taskId, active: true}).populate("user","name active -_id").sort({ createdAt: -1 });
        if(foundFiles) {
            const filterredFiles = foundFiles.map(file => filterField(file,showField));
            sendResponse(res,200,true,{files:filterredFiles},null,"Upload File Success")
        }
    }catch(err){
        next(err);
    }
}
//Response a file detail on a task
taskFileController.responseFileDetail = async(req,res,next)=>{
    try{
        if(req.result.ContentType===req.body.type && req.result.ContentLength === req.body.size){
            const taskId=req.params.id;
            const updatedFile = await File.findOneAndUpdate({task: taskId, _id: req.body._id, active:false },{active: true}).populate("user","name active -_id")
            sendResponse(res,200,true,[filterField(updatedFile,showField)],null,"Upload File Success")
        }

    }catch(err){
        next(err);
    }
}
//Response deleted file
taskFileController.responseFileDeleted = async(req,res,next)=>{
    try{
        const taskId=req.params.id;
        if(req.result.ContentType===req.body.type && req.result.ContentLength === req.body.size){
            const deletedFile = await File.findOneAndUpdate({task:taskId, _id: req.body._id, active:true },{active: false}).populate("user","name active -_id")
            sendResponse(res,200,true,[filterField(deletedFile,showField)],null,"Delete File Success")
        }

    }catch(err){
        next(err);
    }
}

//export
module.exports = taskFileController