const { sendResponse, AppError}=require("../../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Task = require("../../models/Task.js")
const User = require("../../models/User.js");
const { filterField } = require("../../tools/filterData.js");
const { addNotify } = require("../notify.controllers.js");

const userTaskController={};

//add a member
userTaskController.addUser=async(req,res,next)=>{
    try{
        console.log("AAAAAAAAAAAAAAAAAAAAAAA")
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        await body('user')
        .matches(/^[a-z][a-z0-9_]{4,}$/)
        .withMessage('Name must start with a letter and contain only lowercase letters, numbers, and underscores!')
        .run(req);
        await body('role').isIn(['owner', 'manager', 'member','owners', 'managers', 'members']).withMessage('Invalid role').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const userAddName = req.body.user;
        const userAddRole = req.body.role.endsWith("s")? req.body.role.slice(0, -1):req.body.role;
        const {userId} = req.access;
        //transfer name to id
        const foundUser = await User.findOne({name:userAddName,active:true},{_id:1})
        const userAddId = foundUser?._id;
        // recursive function
        async function addToTaskAndChilds (parentId,condition,update) {
            const filter = {parent_task:parentId,active:true,...condition};
            const childTask = await Task.find(filter,{_id:1});
            const length = childTask.length;
            let count = 0;
            for(let i=0;i<length;i++){
                await Task.updateOne({_id:childTask[i]._id},update);
                count += await addToTaskAndChilds(childTask[i]._id,condition,update);
            }
            return count+length;
        }
        async function findRootTask (taskOnTreeId){
            const foundTask = await Task.findOne({_id:taskOnTreeId, active:true},{_id:1,parent_task:1})
            if (foundTask?.parent_task!==null){
                const reFoundTask = await findRootTask(foundTask?.parent_task)
                if(reFoundTask) return reFoundTask;
            }
            return foundTask._id;
        }
        async function addToAllTaskOnTree (aTaskOnTreeId,condition,update) {
            const rootId = await findRootTask(aTaskOnTreeId);
            const filter = {parent_task:rootId,active:true,...condition};
            const childTask = await Task.findOneAndUpdate({_id:rootId,active:true,...condition},update);
            const length = childTask.length;
            let count = 0;
            for(let i=0;i<length;i++){
                await Task.updateOne({_id:childTask[i]._id},update);
                count += await addToTaskAndChilds(childTask[i]._id,condition,update);
            }
            return count+length;
        }
        if(!foundUser || userAddId===userId) return res.status(400).json({ errors: [{ message: 'Can not update users!' }] }); 
        //update the task when user is the owner
        const taskId = req.params.id
        let totalChangedChildTask = 0;
        const updatedTask1 = userAddRole==="member"?
        await Task.findOneAndUpdate({_id:taskId, active:true, "users.owners": userId},{$pull:{"users.owners":userAddId,"users.managers":userAddId},$addToSet:{"users.members":userAddId}})
        :  userAddRole==="manager"?
        await Task.findOneAndUpdate({_id:taskId, active:true, task:{$ne:null}, "users.owners": userId},{$pull:{"users.owners":userAddId,"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
        :await Task.findOneAndUpdate({_id:taskId, active:true, "users.owners": userId},{$pull:{"users.managers":userAddId,"users.members":userAddId},$addToSet:{"users.owners":userAddId}})
        ;
        if(!updatedTask1){ //update the task when user is the manager
            const updatedTask2 = userAddRole==="member"?
            await Task.findOneAndUpdate({_id:taskId, active:true, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.managers":userAddId},$addToSet:{"users.members":userAddId}})
            :  userAddRole==="manager"?
            await Task.findOneAndUpdate({_id:taskId, active:true, task:{$ne:null}, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
            : null; 
            if(!updatedTask2) {  //update the task when user is the member
                const updatedTask3 = userAddRole==="member"?
                await Task.findOneAndUpdate({_id:taskId, active:true, member_add_member: true, "users.members": userId, "users.owners":{$ne:userAddId}, "users.managers":{$ne:userAddId}},{$addToSet:{"users.members":userAddId}})
                : null; 
                if(!updatedTask3) return res.status(400).json({ errors: [{ message: 'Can not update users!' }] }); 
                else {  //update child task when user is the member
                    totalChangedChildTask = await addToTaskAndChilds(updatedTask3._id, {task:{$ne:null}, "users.members": userId, "users.owners":{$ne:userAddId}, "users.managers":{$ne:userAddId}},{$addToSet:{"users.managers":userAddId}})
                }
            } else{ //update child task when user is the manager
                totalChangedChildTask = userAddRole==="member" || userAddRole==="manager" ?
                await addToTaskAndChilds(updatedTask2._id, {task:{$ne:null}, "users.managers": userId, "users.owners":{$ne:userAddId}},{$pull:{"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
                : 0 ; 
            }
        } else{ //update child task when user is the owner
            totalChangedChildTask = userAddRole==="member" || userAddRole==="manager" ?
            await addToTaskAndChilds(updatedTask1._id,{"users.owners": userId},{$pull:{"users.owners":userAddId,"users.members":userAddId},$addToSet:{"users.managers":userAddId}})
            :await addToAllTaskOnTree(updatedTask1._id,{"users.owners": userId},{$pull:{"users.managers":userAddId,"users.members":userAddId},$addToSet:{"users.owners":userAddId}});
        }
        if(updatedTask1.access_locked===true) sendResponse(res,200,true,{user:userAddName,totalChangedChildTask},null,"Change data success")
        const notify={
            task:taskId,
            user:userId,
            sendTo:[...updatedTask1.users.owners?.map(e=>e._id),...updatedTask1.users.managers?.map(e=>e._id),...updatedTask1.users.members?.map(e=>e._id)].filter(u=>u!==userId),
            item:userAddRole,
            readBy:[],
            action:'add',
        }
        switch (userAddRole) {
            case "owner":
              notify.itemOwner = userAddId;
              break;
            case "manager":
              notify.itemManager = userAddId;
              break;
            case "member":
              notify.itemMember = userAddId;
              break;
          }
        req.notify=notify;
        const sendNotify = await addNotify(req)
        if(sendNotify===true) sendResponse(res,200,true,{user:userAddName,totalChangedChildTask},null,"Change data success")
    }catch(err){
        next(err)
    }
}

//delete a member
userTaskController.removeUser=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        await param('user')
        .matches(/^[a-z][a-z0-9_]{4,}$/)
        .withMessage('Name must start with a letter and contain only lowercase letters, numbers, and underscores!')
        .run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const userRemoveName = req.params.user;
        const {userId} = req.access;
        //transfer name to id
        const foundUser = await User.findOne({name:userRemoveName,active:true},{_id:1})
        const userRemoveId = foundUser?._id;
        // recursive function
        async function removeFromTaskAndChilds (parentId,condition,update) {
            const filter = {parent_task:parentId,active:true,...condition};
            const childTask = await Task.find({parent_task:parentId,active:true},{_id:1});
            const length = childTask.length;
            let count = 0;
            for(let i=0;i<length;i++){
                await Task.updateOne({_id:childTask[i]._id},update);
                count += await removeFromTaskAndChilds(childTask[i]._id,condition,update);
            }
            return count+length;
        }
        if(!foundUser || userRemoveId===userId) return res.status(400).json({ errors: [{ message: 'Can not update users!' }] }); 
        //update the task when user is the owner
        const taskId = req.params.id
        let totalChangedChildTask = 0;
        const updatedTask1 = await Task.findOneAndUpdate({_id:taskId, active:true, "users.owners": userId},{$pull:{"users.owners":userRemoveId,"users.managers":userRemoveId,"users.members":userRemoveId}})
        if(!updatedTask1){ //update the task when user is the manager
            const updatedTask2 = await Task.findOneAndUpdate({_id:taskId, active:true, member_add_member:true, "users.managers": userId},{$pull:{"users.managers":userRemoveId,"users.members":userRemoveId}})
            if(!updatedTask2) {  //update the task when user is the member
                const updatedTask3 = await Task.findOneAndUpdate({_id:taskId, active:true, member_add_member: true, "users.member": userId},{$pull:{"users.members":userRemoveId}})
                if(!updatedTask3) return res.status(400).json({ errors: [{ message: 'Can not update users!' }] }); 
                else {
                    totalChangedChildTask = await removeFromTaskAndChilds(updatedTask3._id,null,{$pull:{"users.managers":userRemoveId,"users.members":userRemoveId}})
                }
            } else{ //update child task when user is the manager
                totalChangedChildTask = await removeFromTaskAndChilds(updatedTask2._id,null,{$pull:{"users.managers":userRemoveId,"users.members":userRemoveId}})
            }
        } else{ //update child task when user is the owner
            totalChangedChildTask = await removeFromTaskAndChilds(updatedTask1._id,null,{$pull:{"users.owners":userRemoveId,"users.managers":userRemoveId,"users.members":userRemoveId}})
        }
        sendResponse(res,200,true,{user:userRemoveName,totalChangedChildTask},null,"Change data success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = userTaskController