const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Task = require("../models/Task.js")
const Space = require("../models/Space.js");
const Color = require("../models/Color");
const { filterField } = require("../tools/filterData.js");
const { addNotify } = require("./notify.controllers.js");
const { notify } = require("../routes/notify.api.js");

const showField = {_id:1,users:1,name:1,status:1,description:1,parent_task:1,tree:1,tasks:1, color:1,order:1,member_add_member:1,access_locked:1,edit_locked:1,createdAt:1,updatedAt:1};

const taskController={};
//load parents tree
async function loadTree(_id,userId) {
    const foundTree =[]
    const foundItem = await Task.findOne({_id,$or:[{'users.owners':userId},{'users.managers':userId,access_locked:false},{'users.members':userId,access_locked:false}]},{_id:1, name:1, parent_task:1})
    .populate("users.owners users.managers users.members","name active -_id")
    .populate("color","name background frame text -_id");
    if(foundItem) {
        foundTree.push({_id:foundItem._id.toString(),name:foundItem.name})
        if(foundItem.parent_task) {
            const parent = await loadTree(foundItem.parent_task,userId);
            foundTree.push(...parent)
        }
    }
    return foundTree;
}
//load child task
async function loadTasks(id) {
    const foundList = await Task.find({parent_task:id,active:true},{_id:1,order:1}).sort({order:1});
    if(foundList) {
        const foundTasks = foundList.map(e=>e._id);
        return foundTasks
    }
    return [];
}
//Create a task on root
taskController.createRootTask = async(req,res,next)=>{

    try{
        //check body by express-validator
        await body('name').notEmpty().withMessage('Empty name!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //init
        const userId = req.access.userId;
        let users = {
            owners: userId,
            managers: [],
            members: [],
        };
        const taskColor = req.body.color??"default";
        const color = await Color.findOne({name:taskColor})
        const colorId = color._id
        const newTask ={
            name: req.body.name,
            status: "todo",
            // plan:{
            // start: { type: Date },
            // expiry: { type: Date },
            // },
            // reality:{
            // start: { type: Date },
            // finish: { type: Date },
            // },
            description: "",
            users,
            color: colorId,
            active: true,
            member_add_member:false,
            parent_task:null
        };

        //process
        const created= await Task.create(newTask);
        if(!created) return res.status(400).json({ errors: [{ message: 'Can not create a task!' }] }); 
        const foundTask = await Task.findOne({_id:created._id})
            .populate("users.owners users.managers users.members","name active -_id")
            .populate("color","name background frame text -_id")
        foundTask.tree = [];//await loadTree(created.parent_task)

        sendResponse(res,200,true,filterField(foundTask,showField),null,"Create task Success")
    }catch(err){
        next(err)
    }
}

//Get own task on root
taskController.getOwnTasks=async(req,res,next)=>{
    try{
        let filter = {"users.owners":req.access.userId,parent_task:null,active:true};
        if(req.query.name) filter ={...filter,name:{$regex:req.query.name}};
        if(req.query.status) filter ={...filter,status:req.query.status};
        if(req.query.id) filter ={...filter,_id:req.query.id};
        const sortByTime = req.query.time==="forward"? 1 : req.query.time==="backward"? -1 : 0;
        console.log(filter)
        const listOfFound= await Task.find(filter,showField)
            .populate("users.owners users.managers users.members","name active -_id")
            .populate("color","name frame background text -_id")
            .sort({ order:1, createdAt: sortByTime })
        sendResponse(res,200,true,listOfFound,null,"Found list of task success")

    }catch(err){
        next(err)
    }
}
//Get member task on root
taskController.getMemberTasks=async(req,res,next)=>{
    try{
        let filter = {"users.members":req.access.userId,active:true};
        if(req.query.name) filter ={...filter,name:{$regex:req.query.name}};
        if(req.query.status) filter ={...filter,status:req.query.status};
        if(req.query.id) filter ={...filter,_id:req.query.id};
        const sortByTime = req.query.time==="forward"? 1 : req.query.time==="backward"? -1 : 0;
        const listOfFound= await Task.find(filter,showField)
            .populate("users.owners users.managers users.members","name active -_id")
            .populate("color","name frame background text -_id")
            .sort({ order:1, createdAt: sortByTime })
        sendResponse(res,200,true,listOfFound,null,"Found list of task success")

    }catch(err){
        next(err)
    }
}

///////////

//Create a task on task
taskController.createTask=async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('name').notEmpty().withMessage('Empty name!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //init
        const {userId} = req.access;
        const parentTaskId = req.params.id;
        //find task
        const foundTask = await Task.findOne({_id:parentTaskId, $or:[{"users.owners":userId}, {"users.managers":userId}, {"users.members":userId}], active:true})
        if(!foundTask) return res.status(400).json({ errors: [{ message: 'Can not create a task!' }] }); 
        console.log(foundTask)
        let users = {
            owners: [...foundTask?.users?.owners],
            managers: [...foundTask?.users?.managers, ...foundTask?.users?.members],
            members: [],
        };
        //load 
        const sameLevelTasks = await loadTasks(foundTask._id);
        const order = sameLevelTasks?.length;
        //load color
        const taskColor = req.body.color??"default";
        const color = await Color.findOne({name:taskColor})
        const colorId = color._id
        const newTask ={
            name: req.body.name,
            status: "todo",
            // plan:{
            // start: { type: Date },
            // expiry: { type: Date },
            // },
            // reality:{
            // start: { type: Date },
            // finish: { type: Date },
            // },
            description: "",
            users,
            color: colorId,
            order,
            active: true,
            member_add_member:false,
            parent_task: parentTaskId
        };
        const sortByTime = req.query.time==="forward"? 1 : req.query.time==="backward"? -1 : 0;
        //process
        const createdTask= await Task.create(newTask)
        if(!createdTask) return res.status(400).json({ errors: [{ message: 'Can not create a task!' }] }); 
        const filter = {_id:parentTaskId,$or:[{"users.owners": userId}, {"users.managers": userId}, {"users.members": userId}], active:true}
        const reFoundTask= await Task.findOne(filter).populate("color","name background frame text -_id")
            .populate("users.owners users.managers users.members","name active -_id")
            .populate("color","name frame background text -_id")
            .sort({ order:1, createdAt: sortByTime })
        if(!reFoundTask) return res.status(400).json({ errors: [{ message: 'Wrong task id!' }] });
        reFoundTask.tree = await loadTree(reFoundTask.parent_task,userId);
        reFoundTask.tasks = await loadTasks(reFoundTask._id);
        sendResponse(res,200,true,filterField(reFoundTask,showField),null,"Found list of task success")
    }catch(err){
        next(err)
    }
}

//update task
taskController.updateTask=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Wrong task id!').run(req);

        if(req.body.name) await body('name').isString().withMessage('Invalid name!').run(req);
        if(req.body.description) await body('description').isString().withMessage('Invalid description!').run(req);
        if(req.body.status) await body('status').isString().withMessage('Invalid status!').run(req);
        if(req.body.tasks) await body('tasks').isArray().withMessage('Invalid child tasks!').run(req);
        if(req.body.member_add_member) await body('member_add_member').isBoolean().withMessage('Invalid member_add_member!').run(req);
        if(req.body.access_locked) await body('access_locked').isBoolean().withMessage('Invalid member_add_member!').run(req);
        if(req.body.edit_locked) await body('edit_locked').isBoolean().withMessage('Invalid member_add_member!').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const sortByTime = req.query.time==="forward"? 1 : req.query.time==="backward"? -1 : 0;
        //process
        const taskId = req.params.id
        const {userId} = req.access;
        const { name,status,plan,reality,description,color,tasks,member_add_member,access_locked,edit_locked} = req.body;
        const updateMember = {};
        const updateManager = {};
        const updateOwner = {};
        if(name) updateManager.name=name;
        if(status) updateMember.status=status;
        if(plan) updateManager.plan=plan;
        if(reality) updateMember.reality=reality;
        if(typeof description === "string") updateManager.description=description;
        if(typeof member_add_member === "boolean") updateManager.member_add_member=member_add_member;
        if(typeof access_locked === "boolean") updateOwner.access_locked=access_locked;
        if(typeof edit_locked === "boolean") updateManager.edit_locked=edit_locked;
        if(color){
            const colorFound = await Color.findOne({name:color})
            if(colorFound) {
                const colorId = colorFound._id
                updateManager.color = colorId
            }
        }
        //update order number of child tasks
        if(tasks) {
            //prevent hacking
            const filterredTasks= await Promise.all(tasks.map(async (e,i)=>{
                const foundTask = await Task.findOneAndUpdate({_id:e,active:true,$or:[{"users.owners":userId},{"users.managers":userId},{"users.members":userId}]},{order:i})
                if(foundTask) return e;
                return null;
            }));
            updateMember.tasks=filterredTasks;
        }
        //All request on beyonding authority will be reject by below lines
        //Update owner information
        const updatedTask =
            (Object.keys(updateOwner).length > 0)?
                await Task.findOneAndUpdate({_id:taskId,active:true,"users.owners": userId},{...updateMember,...updateManager,...updateOwner},{new:true})
                    .populate("users.owners users.managers users.members","name active -_id")
                    .populate("color","name frame background text -_id")
                    .sort({ order:1, createdAt: sortByTime })
            :(Object.keys(updateManager).length > 0)?
                await Task.findOneAndUpdate({_id:taskId,active:true,$or:[{"users.owners": userId}, {"users.managers": userId,access_locked:false}]},{...updateMember,...updateManager},{new:true})
                    .populate("users.owners users.managers users.members","name active -_id")
                    .populate("color","name frame background text -_id")
                    .sort({ order:1, createdAt: sortByTime })
            :(Object.keys(updateMember).length > 0)?
                await Task.findOneAndUpdate({_id:taskId,active:true,$or:[{"users.owners": userId}, {"users.managers": userId,access_locked:false}, {"users.members": userId,access_locked:false,edit_locked:false}]},updateMember,{new:true})
                    .populate("users.owners users.managers users.members","name active")
                    .populate("color","name frame background text -_id")
                    .sort({ order:1, createdAt: sortByTime })
            :false;
        if(!updatedTask) {
            return res.status(400).json({ errors: [{ message: 'Can not update the task!' }] }); 
        }
        updatedTask.tree = await loadTree(updatedTask.parent_task,userId);
        updatedTask.tasks = await loadTasks(updatedTask._id);
        //send notify
        if(updatedTask.access_locked===true) sendResponse(res,200,true,filterField(updatedTask,showField),null,"Change data success");
        const notify={
            task:taskId,
            user:userId,
            sendTo:[...updatedTask.users.owners?.map(e=>e._id),...updatedTask.users.managers?.map(e=>e._id),...updatedTask.users.members?.map(e=>e._id)].filter(u=>u!==userId),
            readBy:[],
            action:'change',
            item:'status',
            // itemComment,
            // itemOwner,
            // itemMember,
            // itemFile,
            itemStatus: updatedTask.status,
        }
        req.notify=notify;
        const sendNotify = await addNotify(req)
        if(sendNotify===true) sendResponse(res,200,true,filterField(updatedTask,showField),null,"Change data success")
        
    }catch(err){
        next(err)
    }
}

//Get a task
taskController.getTask=async(req,res,next)=>{
    try{
        //check param by express-validator
        await param('id').isMongoId().withMessage('Wrong task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {userId} = req.access;
        const sortByTime = req.query.time==="forward"? 1 : req.query.time==="backward"? -1 : 0;
        //process
        const taskId=req.params.id;
        const filter = {_id:taskId,$or:[{"users.owners": userId}, {"users.managers": userId}, {"users.members": userId}], active:true}
        const foundTask= await Task.findOne(filter).populate("color","name background frame text -_id")
            .populate("users.owners users.managers users.members","name active -_id")
            .populate("color","name frame background text -_id")
            .sort({ order:1, createdAt: sortByTime })
        if(!foundTask) return res.status(400).json({ errors: [{ message: 'Wrong task id!' }] });
        foundTask.tree = await loadTree(foundTask.parent_task,userId);
        foundTask.tasks = await loadTasks(foundTask._id);
        sendResponse(res,200,true,filterField(foundTask,showField),null,"Found list of task success")
    }catch(err){
        next(err)
    }
}
//Get a task list// note that porpose is get but method is POST
taskController.postTaskList=async(req,res,next)=>{
    try{
        //check param by express-validator
        await body('tasks').isArray().withMessage('Wrong task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {userId} = req.access;
        const sortByTime = req.query.time==="forward"? 1 : req.query.time==="backward"? -1 : 0;
        //process
        const getSplitTask = async (taskId) =>{
            if(!taskId) return null;
            const filter = {
                _id:taskId,
                active:true,
                $or:[
                    {"users.owners": userId},
                    {$and:[{"users.managers": userId},{access_locked:false}]},
                    {$and:[{"users.members": userId},{access_locked:false}]}
                ]
            }
            const foundTask= await Task.findOne(filter).populate("color","name background frame text -_id")
                .populate("users.owners users.managers users.members","name active -_id")
                .populate("color","name frame background text -_id")
                .sort({ order:1, createdAt: sortByTime })
            if(!foundTask) return null;
            foundTask.tree = await loadTree(foundTask.parent_task,userId);
            const filterredTask = filterField(foundTask,showField);
            return filterredTask;
        }
        const requestList = [...new Set(req.body.tasks)];
        const promises = requestList.map(getSplitTask);
        const taskList = await Promise.all(promises);
        const filterredTaskList = taskList.filter(e=>e!==null)
        sendResponse(res, 200, true, filterredTaskList, null, "Found list of task success");
    }catch(err){
        next(err)
    }
}
//delete a task
taskController.deleteTask=async(req,res,next)=>{
    try{
        //check query by express-validator
        await param('id').isMongoId().withMessage('Wrong task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {userId} = req.access;
        //process
        const taskId= req.params.id;
        const changedTask = await Task.findOneAndUpdate({_id:taskId,$or:[{"users.owners":userId},{"users.managers":userId}],active:true},{active:false, task:null})
        .populate("users.owners users.managers users.members","name active -_id")
        .populate("color","name background frame text -_id");
        if(!changedTask) return res.status(400).json({ errors: [{ message: 'Invalid data!' }] });
        // recursive function
        async function deleteChildTasks (parentId) {
            const childTask = await Task.find({parent_task:parentId,active:true},{_id:1});
            const length = childTask.length;
            let count = 0;
            for(let i=0;i<length;i++){
                await Task.updateOne({_id:childTask[i]._id},{active:false});
                count += await deleteChildTasks(childTask[i]._id);
            }
            return count+length;
        }
        if(changedTask?.active===true){
            //delete all child task
            const totalChangedChildTask  = await deleteChildTasks(changedTask._id);
            const totalChangedSpace = await Space.updateMany({tasks:taskId,active:true},{$pull:{tasks:taskId}})
            //update all other
            const changedOtherTaskOrder = changedTask.parent_task? await Task.updateMany({ order: { $gt: changedTask.order??0 },active:true,parent_task:changedTask.parent_task }, { $inc: { order: -1 } }):true;
            if(changedOtherTaskOrder) sendResponse(res,200,true,{id:taskId,totalChangedChildTask,totalChangedSpace:totalChangedSpace?.upsertedCount},null,"Delete task success")
        }
        else return res.status(400).json({ errors: [{ message: 'Invalid data!' }] });
     }catch(err){
         next(err)
     }
 }
//export
module.exports = taskController