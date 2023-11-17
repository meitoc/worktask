const { sendResponse, AppError}=require("../../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Space = require("../../models/Space.js")
const Task = require("../../models/Task.js");
const { filterField } = require("../../tools/filterData.js");
const showField = {_id:1,name:1,description:1,tasks:1,color:1,createdAt:1,updatedAt:1,remove_from_space:1};

const taskSpaceController={};


//update task of space
taskSpaceController.addSpaceTask=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid space id!').run(req);
        await body('task').isMongoId().withMessage('Invalid task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const spaceId = req.params.id
        const {userId} = req.access;
        const taskId = req.body.task;
        const foundTask = await Task.findOne({_id: taskId, $or:[{"users.owners":userId},{"users.members":userId}],active:true});
        if(!foundTask) return res.status(400).json({ errors: [{ msg: 'Can not update the space task!' }] }); 
        const updatedSpace = await Space.findOneAndUpdate({ _id:spaceId,user: userId },{ $addToSet: { tasks: taskId } },{ new: true });
        if(!updatedSpace) return res.status(400).json({ errors: [{ msg: 'Can not update the space task!' }] }); 
        const updatedOtherSpace = await Space.findOneAndUpdate({ _id:{$ne:spaceId},user: userId,tasks:taskId  },{ $pull: { tasks: taskId } },{ new: true });
        if(!updatedOtherSpace) updatedSpace.remove_from_space=updatedOtherSpace?._id??null;
        sendResponse(res,200,true,filterField(updatedSpace,showField),null,"Add task success")
    }catch(err){
        next(err)
    }
}
//remove a task from space
taskSpaceController.removeSpaceTask=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid space id!').run(req);
        await body('task').isMongoId().withMessage('Invalid task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const spaceId = req.params.id
        const {userId} = req.access;
        const taskId = req.body.task;
        const foundTask = await Task.findOne({_id: taskId, $or:[{"users.owners":userId},{"users.members":userId}],active:true});
        if(!foundTask) return res.status(400).json({ errors: [{ msg: 'Can not update the space task!' }] }); 
        const updatedSpace = await Space.findOneAndUpdate({ _id:spaceId,user: userId },{ $pull: { tasks: taskId } },{ new: true });
        if(!updatedSpace) return res.status(400).json({ errors: [{ msg: 'Can not update the space task!' }] }); 
        sendResponse(res,200,true,filterField(updatedSpace,showField),null,"Add task success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = taskSpaceController