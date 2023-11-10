const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Task = require("../models/Task.js")
const User = require("../models/User.js");
const { filterField } = require("../tools/filterData.js");

const showField = {_id:1,users:1,name:1,status:1,description:1,parent_task:1,tree:1, color:1,member_add_member:1,createdAt:1,updatedAt:1};

const taskController={};

async function loadTree(_id) {
    const foundTree =[]
    const foundItem = await Task.findOne({_id},{_id:1, name:1, parent_task:1})
    if(foundItem) {
        foundTree.push({_id:foundItem._id.toString(),name:foundItem.name})
        if(foundItem.parent_task) {
            const parent = await loadTree(foundItem.parent_task);
            foundTree.push(...parent)
        }
    }
    return foundTree;
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
        const newTask ={
            name: req.body.name,
            status: "pending",
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
            color: "6532ae5d2bd43ea0a4b0f78a",
            active: true,
            member_add_member:false,
            parent_task:null
        };

        //process
        const created= await Task.create(newTask)
        if(!created) return res.status(400).json({ errors: [{ msg: 'Can not create a task!' }] }); 
        created.tree = await loadTree(created.parent_task)
        sendResponse(res,200,true,filterField(created,showField),null,"Create task Success")
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
            .sort({ createdAt: sortByTime })
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
            .sort({ createdAt: sortByTime })
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
        if(!foundTask) return res.status(400).json({ errors: [{ msg: 'Can not create a task!' }] }); 
        let users = {
            owners: foundTask.users.owners,
            managers: [...foundTask.users.managers, ...foundTask.users.members],
            members: [],
        };
        const newTask ={
            name: req.body.name,
            status: "pending",
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
            color: "6532ae5d2bd43ea0a4b0f78a",
            active: true,
            member_add_member:false,
            parent_task: parentTaskId
        };

        //process
        const createdTask= await Task.create(newTask)
        if(!createdTask) return res.status(400).json({ errors: [{ msg: 'Can not create a task!' }] }); 
        createdTask.tree = await loadTree(createdTask.parent_task)
        sendResponse(res,200,true,filterField(createdTask,showField),null,"Create task Success")
    }catch(err){
        next(err)
    }
}

//update task
taskController.updateTask=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Wrong task id!').run(req);

        if(req.body.name) await body('name').isString().withMessage('Invalid name!').run(req);
        if(req.body.description) await body('description').isString().withMessage('Invalid description!').run(req);
        if(req.body.status) await body('status').isString().withMessage('Invalid status!').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const taskId = req.params.id
        const {userId} = req.access;
        const { name,status,plan,reality,description} = req.body;
        const update = {};
        if(name) update.name=name;
        if(status) status.name=status;
        if(plan) status.name=plan;
        if(reality) update.reality=reality;
        if(description) update.description=description;
        const updatedTask = await Task.findOneAndUpdate({_id:taskId,$or:[{"users.owners": userId}, {"users.managers": userId}],active:true},update);
        if(!updatedTask) return res.status(400).json({ errors: [{ msg: 'Can not update the task!' }] }); 
        sendResponse(res,200,true,taskId,null,"Change data success")
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
        const foundTask= await Task.findOne(filter)
            .populate("users.owners users.managers users.members","name active -_id")
            .populate("color","name frame background text -_id")
            .sort({ createdAt: sortByTime });
        if(!foundTask) return res.status(400).json({ errors: [{ msg: 'Wrong task id!' }] });
        foundTask.tree = await loadTree(foundTask.parent_task);
        sendResponse(res,200,true,filterField(foundTask,showField),null,"Found list of task success")

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
        const changedTask = await Task.findOneAndUpdate({_id:taskId,$or:[{"users.owners":userId},{"users.managers":userId}],active:true},{active:false, task:null});
        if(!changedTask) return res.status(400).json({ errors: [{ msg: 'Invalid data!' }] });
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
            sendResponse(res,200,true,{id:taskId,totalChangedChildTask},null,"Delete task success")
        }
        else return res.status(400).json({ errors: [{ msg: 'Invalid data!' }] });
     }catch(err){
         next(err)
     }
 }
//export
module.exports = taskController