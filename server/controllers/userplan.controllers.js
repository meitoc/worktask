const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const UserPlan = require("../models/UserPlan.js")
const Plan = require("../models/Plan.js")

const userPlanController={}

//Create a user plan
userPlanController.createUserPlan = async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('plan_code').notEmpty().withMessage('Invalid plan code!').run(req);
        // await body('user_name').notEmpty().withMessage('Invalid user name!').run(req);
        await body('start').isISO8601().withMessage('Invalid start!').run(req);
        await body('expiry').isISO8601().withMessage('Invalid expiry!').run(req);
        await body('paid').isBoolean().withMessage('Invalid paid!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const planCode = req.body.plan_code;
        // const userName = req.body.user_name;
        const {start, expiry, paid, total_paid} = req.body;
        //load user_name
        const matchedPlan = await Plan.findOne({code: planCode});
        console.log(matchedPlan);
        if(!matchedPlan)
        return res.status(400).json({ errors:[{"type": "field", "value": req.body.plan_code, msg: "Invalid plan code!", path: "plan_code", location:"body"}] });
        
        //process
        const info = {
            plan: matchedPlan._id,
            start,
            expiry,
            paid,
            total_paid    
        }
        const created= await UserPlan.create(info);
        if(info.code===created.code) sendResponse(res,200,true,{data:info},null,"Create userPlan Success")
    }catch(err){
        //error
        if (err.code === 11000) {
        return res.status(400).json({ errors:[{"type": "field", "value": req.body.code, msg: "Name is already exist!", path: "code", location:"body"}] });
        }
        //show other error for admin
        next(err);
    }
}


//update user plan status
userPlanController.updateUserPlan=async(req,res,next)=>{
    try{
        //check body by express-validator
        await param('id').isMongoId().withMessage('Invalid user plan id!').run(req);
        await body('plan_code').notEmpty().withMessage('Invalid plan code!').run(req);
        // await body('user_name').notEmpty().withMessage('Invalid user name!').run(req);
        await body('start').isISO8601().withMessage('Invalid start!').run(req);
        await body('expiry').isISO8601().withMessage('Invalid expiry!').run(req);
        await body('paid').isBoolean().withMessage('Invalid paid!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const planCode = req.body.plan_code;
        // const userName = req.body.user_name;
        //load user_name
        const matchedPlan = await Plan.findOne({code: planCode});
        if(!matchedPlan)
        return res.status(400).json({ errors:[{"type": "field", "value": req.body.plan_code, msg: "Invalid plan code!", path: "plan_code", location:"body"}] });
    
        const id = req.params.id;
        const {start, expiry, paid, total_paid} = req.body;
        //process
        const refFound = await UserPlan.findOneAndUpdate({_id:id},{plan_code: matchedPlan._id, start, expiry, paid, total_paid},{upsert: true, new:true});
        sendResponse(res,200,true,{data:refFound},null,"Update userPlan success")
    }catch(err){
        //show other error for admin
        next(err)
    }
}

//Get all user plan
userPlanController.getAllUserPlans=async(req,res,next)=>{
    let filter = {}
    const {userId, role} = req.access;
    if(role!=="admin"){
        filter={user:userId}
    }
    if(req.query.paid==="true") filter ={paid:true};
    if(req.query.paid==="false") filter ={paid:false};
    // if(req.query.plan) filter ={...filter,plan:{name:{$regex:req.query.plan}}};
    const sortByAbc = req.query.sort==="forward"? 1 : req.query.sort==="backward"? -1 : 0;
    try{
        const listOfFound= (req.query.detail==="true")?
            await UserPlan.find(filter).populate("plan").sort({ code: sortByAbc })
            : await UserPlan.find(filter).sort({ code: sortByAbc });
        sendResponse(res,200,true,{data:listOfFound},null,"Found list of userPlans success")

    }catch(err){
        //no show public
        return res.status(400).json({ errors: [{msg: "Unkown error"}] });
    }
}
//Get a user plan
userPlanController.getUserPlan=async(req,res,next)=>{
    try{
        //no need to check param by express-validator
        //process
        const id=req.params.id;
        const {userId, role} = req.access;
        if(role==="admin" || userId===id){
            // const user=req.params.user_name;
            const filter = {_id:id}
            const listOfFound= (req.query.detail==="true")?
                await UserPlan.find(filter).populate("plan")
                : await UserPlan.find(filter);
            sendResponse(res,200,true,{data:listOfFound},null,"Found list of userPlans success")
        }else return res.status(400).json({ errors: [{msg: "No accept to access!"}] });
    }catch(err){
        next(err)
    }
}
//delete a user plan
userPlanController.deleteUserPlan=async(req,res,next)=>{
    try{
        //check query by express-validator
        await param('id').notEmpty().withMessage('Empty userplan id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const id= req.params.id;
        const userPlanChange = await UserPlan.findOneAndDelete({_id:id});
        sendResponse(res,200,true,{data:userPlanChange},null,"Delete userPlan success")
     }catch(err){
         next(err)
     }
 }
//export
module.exports = userPlanController