const { sendResponse, AppError}=require("../../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Task = require("../../models/Task.js")
const Color = require("../../models/Color.js");
const { filterField } = require("../../tools/filterData.js");
const showField = {name:1,frame:1,background:1,text:1};

const colorTaskController={};


//update color of task
colorTaskController.updateTaskColor=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        await body('name').isString().withMessage('Invalid color name!').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const taskId = req.params.id
        const {userId} = req.access;
        const colorName = req.body.name;
        const foundColor = await Color.findOne({name: colorName});
        if(!foundColor) return res.status(400).json({ errors: [{ msg: 'Can not update the task color!' }] }); 
        const updatedTask = await Task.findOneAndUpdate({_id:taskId,$or:[{"users.owners": userId}, {"users.managers": userId}],active:true},{color:foundColor._id});
        if(!updatedTask) return res.status(400).json({ errors: [{ msg: 'Can not update the task color!' }] }); 
        sendResponse(res,200,true,{data:filterField(foundColor,showField)},null,"Change color success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = colorTaskController