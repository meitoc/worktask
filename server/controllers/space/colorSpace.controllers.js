const { sendResponse, AppError}=require("../../helpers/utils.js")
const { query, body, param, validationResult } = require('express-validator');
const Space = require("../../models/Space.js")
const Color = require("../../models/Color.js");
const { filterField } = require("../../tools/filterData.js");
const showField = {name:1,frame:1,background:1,text:1};

const colorSpaceController={};


//update color of space
colorSpaceController.updateSpaceColor=async(req,res,next)=>{
    try{
        console.log(req.params.id)
        //check param and query by express-validator
        await param('id').isMongoId().withMessage('Invalid space id!').run(req);
        await body('name').isString().withMessage('Invalid color name!').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //process
        const spaceId = req.params.id
        const {userId} = req.access;
        const colorName = req.body.name;
        const foundColor = await Color.findOne({name: colorName});
        if(!foundColor) return res.status(400).json({ errors: [{ message: 'Can not update the space color!' }] }); 
        const updatedSpace = await Space.findOneAndUpdate({_id:spaceId,user: userId},{color:foundColor._id});
        if(!updatedSpace) return res.status(400).json({ errors: [{ message: 'Can not update the space color!' }] }); 
        sendResponse(res,200,true,{data:filterField(foundColor,showField)},null,"Change color success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = colorSpaceController