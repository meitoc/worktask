const { sendResponse, AppError}=require("../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Space = require("../models/Space.js")
const Plan = require("../models/Plan.js")//use later for real deploy within payment
const { filterField } = require("../tools/filterData.js");

const showField = {_id:1,name:1,description:1,color:1,createdAt:1,updatedAt:1};

const spaceController={}

//Create a space
spaceController.createSpace = async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('name').isString().withMessage('Invalid space name!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //process
        const {userId} = req.access;
        const spaceName = req.body.name;
        const info = {
            name: spaceName,
            tasks:[],
            user:userId,
            color:"6532ae5d2bd43ea0a4b0f78a"
        }
        const created= await Space.create(info);
        if(!created) return res.status(400).json({ errors: [{ msg: 'Can not create a space!' }] }); 
        const foundSpace = await Space.findOne({_id:created._id}).populate("color","name background frame text -_id")
        if(!foundSpace) return res.status(400).json({ errors: [{ msg: 'Can not create a space!' }] }); 
        sendResponse(res,200,true,{data:filterField(foundSpace,showField)},null,"Create space Success")
    }catch(err){
        next(err);
    }
}


//update space status
spaceController.updateSpace=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Wrong task id!').run(req);

        if(req.body.name) await body('name').isString().withMessage('Invalid name!').run(req);
        if(req.body.description) await body('description').isString().withMessage('Invalid description!').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const spaceId = req.params.id
        const {userId} = req.access;
        const { name,description} = req.body;
        const update = {};
        if(name) update.name=name;
        if(description) update.description=description;
        const updatedSpace = await Space.findOneAndUpdate({_id:spaceId,user: userId},update);
        if(!updatedSpace) return res.status(400).json({ errors: [{ msg: 'Can not update the task!' }] }); 
        sendResponse(res,200,true,{data:spaceId},null,"Change data success")
    }catch(err){
        next(err)
    }
}

//Get all space
spaceController.getAllSpaces=async(req,res,next)=>{
    let filter = {}
    const {userId, role} = req.access;
    if(role!=="user"){
        filter={user:userId}
    }
    const sortByAbc = req.query.sort==="forward"? 1 : req.query.sort==="backward"? -1 : 0;
    try{
        const listOfFound= (req.query.detail==="true")?
            await Space.find(filter).populate("color","name background frame text -_id").sort({ name: sortByAbc })
            : await Space.find(filter).sort({ code: sortByAbc });
        sendResponse(res,200,true,{data:listOfFound},null,"Found list of spaces success")

    }catch(err){
        //no show public
        return res.status(400).json({ errors: [{msg: "Unkown error"}] });
    }
}
//Get a space
spaceController.getSpace=async(req,res,next)=>{
    try{
        //no need to check param by express-validator
        //process
        const id=req.params.id;
        const {userId, role} = req.access;
        if(role==="user" || userId===id){
            // const user=req.params.user_name;
            const filter = {_id:id,user:userId}
            const listOfFound=  await Space.find(filter).populate("color","name background frame text -_id")
            sendResponse(res,200,true,{data:listOfFound},null,"Found list of spaces success")
        }else return res.status(400).json({ errors: [{msg: "No accept to access!"}] });
    }catch(err){
        next(err)
    }
}
//delete a space
spaceController.deleteSpace=async(req,res,next)=>{
    try{
        //check query by express-validator
        await param('id').notEmpty().withMessage('Empty userplan id!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const id= req.params.id;
        const spaceChange = await Space.deleteOne({_id:id});
        sendResponse(res,200,true,{data:spaceChange},null,"Delete space success")
     }catch(err){
         next(err)
     }
 }
//export
module.exports = spaceController