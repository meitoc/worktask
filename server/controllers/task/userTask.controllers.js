const { sendResponse, AppError}=require("../../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Task = require("../../models/Task.js")
const User = require("../../models/User.js");
const { filterField } = require("../../tools/filterData.js");

const userTaskController={};

//add a member
userTaskController.addUser=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        await body('user')
        .matches(/^[a-z][a-z0-9_]{4,}$/)
        .withMessage('Name must start with a letter and contain only lowercase letters, numbers, and underscores!')
        .run(req);
        await body('level').isIn(['owner', 'manager', 'member']).withMessage('Invalid level').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const userAddName = req.body.user;
        const userAddLevel = req.body.level;
        const {userId} = req.access;
        //transfer name to id
        const foundUser = await User.findOne({name:userAddName,active:true},{_id:1})
        const userAddId = foundUser._id?.toString();
        // recursive function
        async function addToTaskAndChild (parentId,condition,update) {
            const filter = {parent_task:parentId,active:true,...condition};
            const childTask = await Task.find({parent_task:parentId,active:true},{_id:1});
            const length = childTask.length;
            let count = 0;
            for(let i=0;i<length;i++){
                await Task.updateOne({_id:childTask[i]._id},update);
                count += await addToTaskAndChild(childTask[i]._id,condition,update);
            }
            return count+length;
        }
        if(!foundUser || userAddId===userId) return res.status(400).json({ errors: [{ msg: 'Can not update users!' }] }); 
        //update the task when user is the owner
        const taskId = req.params.id
        let totalChangedChildTask = 0;
        const updatedTask1 = userAddLevel==="member"?
        await Task.findOneAndUpdate({_id:taskId, active:true, "users.owners": userId},{$pull:{"users.owners":userAddId,"users.managers":userAddId},$addToSet:{"users.members":userAddId}})
        :  userAddLevel==="manager"?
        await Task.findOneAndUpdate({_id:taskId, active:true, task:{$ne:null}, "users.owners": userId},{$pull:{"users.owners":userAddId,"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
        :await Task.findOneAndUpdate({_id:taskId, active:true, "users.owners": userId},{$pull:{"users.managers":userAddId,"users.members":userAddId},$addToSet:{"users.owners":userAddId}})
        ;
        if(!updatedTask1){ //update the task when user is the manager
            const updatedTask2 = userAddLevel==="member"?
            await Task.findOneAndUpdate({_id:taskId, active:true, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.managers":userAddId},$addToSet:{"users.members":userAddId}})
            :  userAddLevel==="manager"?
            await Task.findOneAndUpdate({_id:taskId, active:true, task:{$ne:null}, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
            : null; 
            if(!updatedTask2) {  //update the task when user is the member
                const updatedTask3 = userAddLevel==="member"?
                await Task.findOneAndUpdate({_id:taskId, active:true, member_add_member: true, "users.member": userId, "users.owners":{$ne:userAddId}, "users.managers":{$ne:userAddId}},{$addToSet:{"users.members":userAddId}})
                : null; 
                if(!updatedTask3) return res.status(400).json({ errors: [{ msg: 'Can not update users!' }] }); 
                else {  //update child task when user is the member
                    totalChangedChildTask = await addToTaskAndChild(updatedTask3._id, {task:{$ne:null}, "users.members": userId, "users.owners":{$ne:userAddId}, "users.managers":{$ne:userAddId}},{$addToSet:{"users.managers":userAddId}})
                }
            } else{ //update child task when user is the manager
                totalChangedChildTask = userAddLevel==="member" || userAddLevel==="manager" ?
                await addToTaskAndChild(updatedTask2._id, {task:{$ne:null}, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
                : 0 ; 
            }
        } else{ //update child task when user is the owner
            totalChangedChildTask = userAddLevel==="member" || userAddLevel==="manager" ?
            await addToTaskAndChild(updatedTask1._id,{"users.owners": userId},{$pull:{"users.owners":userAddId,"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
            :await addToTaskAndChild(updatedTask1._id,{"users.owners": userId},{$pull:{"users.managers":userAddId,"users.members":userAddId},$addToSet:{"users.owners":userAddId}})
            ;
        }
        
        sendResponse(res,200,true,{user:userAddName,totalChangedChildTask},null,"Change data success")
    }catch(err){
        next(err)
    }
}

//delete a member
userTaskController.removeUser=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        await body('user')
        .matches(/^[a-z][a-z0-9_]{4,}$/)
        .withMessage('Name must start with a letter and contain only lowercase letters, numbers, and underscores!')
        .run(req);
        await body('level').isIn(['owner', 'manager', 'member']).withMessage('Invalid level').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const userAddName = req.body.user;
        const userAddLevel = req.body.level;
        const {userId} = req.access;
        //transfer name to id
        const foundUser = await User.findOne({name:userAddName,active:true},{_id:1})
        const userAddId = foundUser._id?.toString();
        // recursive function
        async function addToTaskAndChild (parentId,condition,update) {
            const filter = {parent_task:parentId,active:true,...condition};
            const childTask = await Task.find({parent_task:parentId,active:true},{_id:1});
            const length = childTask.length;
            let count = 0;
            for(let i=0;i<length;i++){
                await Task.updateOne({_id:childTask[i]._id},update);
                count += await addToTaskAndChild(childTask[i]._id,condition,update);
            }
            return count+length;
        }
        if(!foundUser || userAddId===userId) return res.status(400).json({ errors: [{ msg: 'Can not update users!' }] }); 
        //update the task when user is the owner
        const taskId = req.params.id
        let totalChangedChildTask = 0;
        const updatedTask1 = userAddLevel==="member"?
        await Task.findOneAndUpdate({_id:taskId, active:true, "users.owners": userId},{$pull:{"users.owners":userAddId,"users.managers":userAddId},$addToSet:{"users.members":userAddId}})
        :  userAddLevel==="manager"?
        await Task.findOneAndUpdate({_id:taskId, active:true, task:{$ne:null}, "users.owners": userId},{$pull:{"users.owners":userAddId,"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
        :await Task.findOneAndUpdate({_id:taskId, active:true, "users.owners": userId},{$pull:{"users.managers":userAddId,"users.members":userAddId},$addToSet:{"users.owners":userAddId}})
        ;
        if(!updatedTask1){ //update the task when user is the manager
            const updatedTask2 = userAddLevel==="member"?
            await Task.findOneAndUpdate({_id:taskId, active:true, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.managers":userAddId},$addToSet:{"users.members":userAddId}})
            :  userAddLevel==="manager"?
            await Task.findOneAndUpdate({_id:taskId, active:true, task:{$ne:null}, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
            : null; 
            if(!updatedTask2) {  //update the task when user is the member
                const updatedTask3 = userAddLevel==="member"?
                await Task.findOneAndUpdate({_id:taskId, active:true, member_add_member: true, "users.member": userId, "users.owners":{$ne:userAddId}, "users.managers":{$ne:userAddId}},{$addToSet:{"users.members":userAddId}})
                : null; 
                if(!updatedTask3) return res.status(400).json({ errors: [{ msg: 'Can not update users!' }] }); 
                else {  //update child task when user is the member
                    totalChangedChildTask = await addToTaskAndChild(updatedTask3._id, {task:{$ne:null}, "users.members": userId, "users.owners":{$ne:userAddId}, "users.managers":{$ne:userAddId}},{$addToSet:{"users.managers":userAddId}})
                }
            } else{ //update child task when user is the manager
                totalChangedChildTask = userAddLevel==="member" || userAddLevel==="manager" ?
                await addToTaskAndChild(updatedTask2._id, {task:{$ne:null}, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
                : 0 ; 
            }
        } else{ //update child task when user is the owner
            totalChangedChildTask = userAddLevel==="member" || userAddLevel==="manager" ?
            await addToTaskAndChild(updatedTask1._id,{"users.owners": userId},{$pull:{"users.owners":userAddId,"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
            :await addToTaskAndChild(updatedTask1._id,{"users.owners": userId},{$pull:{"users.managers":userAddId,"users.members":userAddId},$addToSet:{"users.owners":userAddId}})
            ;
        }
        
        sendResponse(res,200,true,{user:userAddName,totalChangedChildTask},null,"Change data success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = userTaskController