const { sendResponse, AppError}=require("../helpers/utils.js")
const { param, body, validationResult } = require('express-validator');
const User = require("../models/User.js")
const Task = require("../models/Task.js")

const userController={}
//Create a user
userController.createUser=async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('name').notEmpty().withMessage('Empty user name!').run(req);
        await body('role').notEmpty().withMessage('Empty user role!').run(req);
        await body('password').notEmpty().withMessage('Empty user password!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const info = {
            name:req.body.name,
            role: req.body.role,
            active: true,
            password: req.body.password
        }
        const existUser = info.name==="manager"
        ?await User.findOne({$or:[{name:info.name},{role:"manager"}]})
        :await User.findOne({name:info.name});
        if(existUser) 
        return res.status(400).json({ errors: [{ msg: 'User existed or unvalable' }] });
        // throw new AppError(400,"Bad Request","User existed or unvalable");
        else try{
            if(!info.name || !info.password) 
            return res.status(400).json({ errors: [{ msg: 'Create User Error' }] });
            // throw new AppError(400,"Bad Request","Create User Error")
            const created= await User.create(info)
            sendResponse(res,200,true,{data:created},null,"Create User Success")
        }catch(err){
            next(err)
        };
    }catch(err){
        next(err)
    }
}
//Get a user
userController.getUserInfo=async(req,res,next)=>{
    const name = req.params.name;
    const filter = name===undefined?{active:true}:{name, active:true}
    try{
        const listOfFound= await User.find(filter)
        if(listOfFound.length<=0)return res.status(400).json({ errors: [{ msg: 'Invalid user name' }] }); 
        let filterredList = listOfFound.map(element => ({
            name: element.name,
            role: element.role,
        }));
        if(name!==undefined && req.query.tasks==="all" && listOfFound.length>0){
            try{
                const tasks = await Task.find({users: listOfFound[0]._id});
                const filterredTask = tasks.map(element=>element._id);
                filterredList = {...filterredList, tasks: filterredTask};
            }catch(err){
                next(err)
            }
        }
        sendResponse(res,200,true,{users:filterredList},null,"Found list of users success")
    }catch(err){
        next(err)
    }
}
//Update a user
userController.updateUserByName=async(req,res,next)=>{
    
    try{
        //check body by express-validator
        await param('name').notEmpty().withMessage('Empty user name!').run(req);
        await body('password').notEmpty().withMessage('Empty user password!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const name = req.params.name;
        const updateInfo = {
            password: req.body.password
        };
        //no secure now
        const updated= await User.findOneAndUpdate({name},updateInfo)
        sendResponse(res,200,true,{data:updated},null,"Update user success")
    }catch(err){
        next(err)
    }
}
//Delete user
userController.deleteUserByName=async(req,res,next)=>{
    try{
        //check body by express-validator
        await param('name').notEmpty().withMessage('Empty user name!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const name = req.params.name;
        const updated= await User.findOneAndDelete({name})
        if(updated) 
        //hide updated for secure
        sendResponse(res,200,true,{},null,"Delete user success");
        else return res.status(400).json({ errors: [{ msg: 'No matched data' }] });
        // else throw new AppError(400,"Bad Request","No matched data");
    }catch(err){
        next(err)
    }
}
//export
module.exports = userController