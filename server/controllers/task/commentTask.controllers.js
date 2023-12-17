const { sendResponse, AppError}=require("../../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Task = require("../../models/Task.js")
const Comment = require("../../models/Comment.js");
const { filterField } = require("../../tools/filterData.js");
const showField = {_id:1, user:1,createdAt:1,comment:1}

const commentTaskController={};

//add a comment
commentTaskController.addComment=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        await body('comment').isString().withMessage('Invalid comment content!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const taskId = req.params.id;
        const {comment} = req.body;
        const {userId} = req.access;
        const foundTask = await Task.findOne({_id:taskId,active:true,$or:[{"users.owners":userId},{"users.managers":userId},{"users.members":userId}]})
        if(!foundTask) return res.status(400).json({ errors: [{ message: 'Can not add your comment!' }] }); 
        const createdcomment = await Comment.create({user:userId,task:taskId,comment,active:true})
        if(!createdcomment) return res.status(400).json({ errors: [{ message: 'Can not add your comment!' }] }); 
        const foundComments = await Comment.findOne({_id:createdcomment?._id}).populate("user","name -_id").sort({ createdAt: 'desc' })
        sendResponse(res,200,true,filterField(foundComments,showField),null,"Add comment success")
    }catch(err){
        next(err)
    }
}
//Get all comment of task
commentTaskController.getComments=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const taskId = req.params.id;
        const {userId} = req.access;
        const foundTask = await Task.find({_id:taskId,active:true,$or:[{"users.owners":userId},{"users.managers":userId},{"users.members":userId}]})
        if(!foundTask) return res.status(400).json({ errors: [{ message: 'Can not get task comments!' }] }); 
        const foundComments = await Comment.find({task:taskId,active:true}).populate("user","name -_id").sort({ createdAt: 'desc' })
        const filterredComment = foundComments.map((e)=>{
            return filterField(e,showField);
        })
        sendResponse(res,200,true,{comments:filterredComment},null,"Get task comment success")
    }catch(err){
        next(err)
    }
}

//delete a comment
commentTaskController.deleteComment=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const taskId = req.params.id;
        const commentId = req.params.commentId;
        const {userId} = req.access;
        const foundTask = await Task.find({_id:taskId,active:true,$or:[{"users.owners":userId},{"users.managers":userId},{"users.managers":userId}]})
        if(!foundTask) return res.status(400).json({ errors: [{ message: 'Can not delete comment!' }] }); 
        const foundComments = await Comment.findOneAndUpdate({_id:commentId, task:taskId},{active:false});
        if(!foundComments) return res.status(400).json({ errors: [{ message: 'Can not delete comment!' }] }); 
        sendResponse(res,200,true,{id:commentId},null,"Get task comment success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = commentTaskController