const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Color = require("../models/Color.js")

const colorController={}

colorController.createColor = async(req,res,next)=>{
//Create a color
    try{
        //check body by express-validator
        await body('name').notEmpty().withMessage('Empty name!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //process
        const info = {
            name: req.body.name,
            frame: req.body.frame,
            background: req.body.background,
            text: req.body.text
        }
        const created= await Color.create(info);
        if(info.name===created.name) sendResponse(res,200,true,{data:info},null,"Create color Success")
    }catch(err){
        //error
        if (err.code === 11000) {
        return res.status(400).json({ errors:[{"type": "field", "value": req.body.name, msg: "Name is already exist!", path: "name", location:"body"}] });
        }
        //show other error for admin
        next(err);
    }
}


//update color status
colorController.updateColor=async(req,res,next)=>{
    try{
        //check param and query by express-validator
        await param('name').notEmpty().withMessage('Empty color name!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const name = req.params.name;
        const { background, frame, text } = req.body
        const refFound = await Color.findOneAndUpdate({name},{ background, frame, text },{upsert: true, new:true, select:'name background frame text -_id'});
        sendResponse(res,200,true,{data:refFound},null,"Update color success")
    }catch(err){
        //show other error for admin
        next(err)
    }
}

//Get all color
colorController.getAllColors=async(req,res,next)=>{
    let filter = {}
    if(req.query.name) filter ={...filter,name:{$regex:req.query.name}};
    const sortByAbc = req.query.sort==="forward"? 1 : req.query.sort==="backward"? -1 : 0;
    try{
        const listOfFound= await Color.find(filter, {name:1, frame:1, background:1, text:1, _id:0}).sort({ name: sortByAbc });
        sendResponse(res,200,true,{data:listOfFound},null,"Found list of colors success")

    }catch(err){
        //no show public
        return res.status(400).json({ errors: [{msg: "Unkown error"}] });
    }
}
//Get a color
colorController.getColor=async(req,res,next)=>{
    try{
        //no need to check param by express-validator
        //process
        const name=req.params.name;
        const filter = {name}
        const listOfFound= await Color.find(filter, {name:1, frame:1, background:1, text:1, _id:0});
        sendResponse(res,200,true,{data:listOfFound},null,"Found list of colors success")

    }catch(err){
        next(err)
    }
}
//delete a color
colorController.deleteColor=async(req,res,next)=>{
    try{
        //check query by express-validator
        await param('name').notEmpty().withMessage('Empty color id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const name= req.params.name;
        const colorChange = await Color.findOneAndDelete({name},{select:'name background frame text -_id'});
        sendResponse(res,200,true,{data:colorChange},null,"Delete color success")
     }catch(err){
         next(err)
     }
 }
//export
module.exports = colorController