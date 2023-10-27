const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Plan = require("../models/Plan.js")

const planController={}

//Create a plan
planController.createPlan = async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('code').notEmpty().withMessage('Empty code!').run(req);
        await body('name').notEmpty().withMessage('Empty name!').run(req);
        await body('permissions').notEmpty().withMessage('Empty permissions!').run(req);
        await body('active').isBoolean().withMessage('Invalid active!').run(req);
        await body('price').notEmpty().withMessage('Invalid price!').run(req);
        await body('duration').isNumeric().withMessage('Invalid duration!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //process
        const info = {
            code: req.body.code,
            name: req.body.name,
            active: req.body.active,
            price: {amount: req.body.price.amount,currency: req.body.price.currency},
            duration: req.body.duration,
            permissions: req.body.permissions.map(e=>{return{name:e.name, value:e.value, number:e.number}})
        }
        const created= await Plan.create(info);
        if(info.code===created.code) sendResponse(res,200,true,{data:info},null,"Create plan Success")
    }catch(err){
        //error
        if (err.code === 11000) {
        return res.status(400).json({ errors:[{"type": "field", "value": req.body.code, msg: "Name is already exist!", path: "code", location:"body"}] });
        }
        //show other error for admin
        next(err);
    }
}


//update plan status
planController.updatePlan=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('code').notEmpty().withMessage('Empty code!').run(req);
        await body('name').notEmpty().withMessage('Empty name!').run(req);
        await body('permissions').notEmpty().withMessage('Empty permissions!').run(req);
        await body('active').isBoolean().withMessage('Invalid active!').run(req);
        await body('price').notEmpty().withMessage('Invalid price!').run(req);
        await body('duration').isNumeric().withMessage('Invalid duration!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const code = req.params.code;
        const { name, price, duration, permissions } = req.body
        const refFound = await Plan.findOneAndUpdate({code},{ name, price, duration, permissions},{upsert: true, new:true, select:'code background frame text -_id'});
        sendResponse(res,200,true,{data:refFound},null,"Update plan success")
    }catch(err){
        //show other error for admin
        next(err)
    }
}

//Get all plan
planController.getAllPlans=async(req,res,next)=>{
    let filter = {active: true}
    if(req.query.code) filter ={...filter,code:{$regex:req.query.code}};
    const sortByAbc = req.query.sort==="forward"? 1 : req.query.sort==="backward"? -1 : 0;
    try{
        const listOfFound= await Plan.find(filter, {code:1, name:1, price:1, duration:1, permissions:1, _id:0}).sort({ code: sortByAbc });
        sendResponse(res,200,true,{data:listOfFound},null,"Found list of plans success")

    }catch(err){
        //no show public
        return res.status(400).json({ errors: [{msg: "Unkown error"}] });
    }
}
//Get a plan
planController.getPlan=async(req,res,next)=>{
    try{
        //no need to check param by express-validator
        //process
        const code=req.params.code;
        const filter = {code}
        const listOfFound= await Plan.find(filter, {code:1, name:1, price:1, duration:1, permissions:1, _id:0});
        sendResponse(res,200,true,{data:listOfFound},null,"Found list of plans success")

    }catch(err){
        next(err)
    }
}
//delete a plan
planController.deletePlan=async(req,res,next)=>{
    try{
        //check query by express-validator
        await query('code').notEmpty().withMessage('Empty plan id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const code= req.query.code;
        const planChange = await Plan.findOneAndDelete({code},{select:'code background frame text -_id'});
        sendResponse(res,200,true,{data:planChange},null,"Delete plan success")
     }catch(err){
         next(err)
     }
 }
//export
module.exports = planController