const { param, validationResult } = require('express-validator');
const Task = require("../models/Task.js");
const fileValidator={}
//Check avatar image
fileValidator.avatarCheck = async(req,res,next)=>{
    try{
        const {userId} = req.access;
        if (req.file?.fieldname!=="image") {
            return res.status(400).json({ errors:[{"type": "data", message: "Image is invalid!"}] });
        }
        req.key=`avatar/${userId}.jpg`;
        next();
    }catch(err){
        next(err);
    }
}

//Check file acces authorication and 
fileValidator.taskAccessCheck = async(req,res,next)=>{
    try{
        await param('id').isMongoId().withMessage('Wrong task id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {userId} = req.access;
        const taskId=req.params.id;
        const filter = {_id:taskId,$or:[{"users.owners": userId}, {"users.managers": userId}, {"users.members": userId}], active:true}
        const foundTask= await Task.findOne(filter);
        if(!foundTask) return res.status(400).json({ errors: [{ message: 'Wrong task id!' }] });
        next();
    }catch(err){
        next(err);
    }
}
//export
module.exports = fileValidator