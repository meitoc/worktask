const { sendResponse, AppError}=require("../../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Task = require("../../models/Task.js")

const memberAddMemberController={};


//update color of task
memberAddMemberController.memberAddMember=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid task id!').run(req);
        await body('value').isBoolean().withMessage('Invalid value!').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const taskId = req.params.id
        const {userId} = req.access;
        const member_add_member = req.body.value;
        const updatedTask = await Task.findOneAndUpdate({_id:taskId, active:true, $or:[{"users.owners": userId}, {"users.managers": userId}]},{member_add_member});
        if(!updatedTask) return res.status(400).json({ errors: [{ msg: 'Can not update the task member_add_member!' }] }); 
        sendResponse(res,200,true,{data:{member_add_member}},null,"Change member_add_member success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = memberAddMemberController