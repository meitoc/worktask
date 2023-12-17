const { sendResponse, AppError}=require("../helpers/utils.js")
const { param, body, validationResult } = require('express-validator');
const UserInfo = require("../models/UserInfo.js")
const User = require("../models/User.js");
const { filterField } = require("../tools/filterData.js");

const showField = {name:1,email:1,phone:1,information:1}
const userInfoController={}
//Create a userInfo
userInfoController.updateAUserInfo=async(req,res,next)=>{
    try{
        //check body by express-validator
        if(req.body.real_name) await body('real_name').isString().withMessage('Invalid real_name!').run(req);
        if(req.body.gender) await body('gender').isString().withMessage('Invalid gender!').run(req);
        if(req.body.birthday) await body('birthday').isString().withMessage('Invalid birthday!').run(req);
        if(req.body.organization) await body('organization').isString().withMessage('Invalid organization!').run(req);
        if(req.body.position) await body('position').isString().withMessage('Invalid position!').run(req);
        if(req.body.avatar) await body('avatar').isString().withMessage('Invalid avatar!').run(req);
        if(req.body.location) await body('location').isString().withMessage('Invalid location!').run(req);
        if(req.body.experiences) await body('experiences').isString().withMessage('Invalid experiences!').run(req);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {userId}= req.access;
        const { real_name, gender,birthday,organization,position, avatar, location, experiences } = req.body;
        const newUserInfo = { real_name, gender,birthday,organization,position, avatar, location, experiences,user:userId }

        const foundUser = await User.findOne({_id:userId},"information")
        const updated= await UserInfo.findOneAndUpdate({_id:foundUser.information},newUserInfo,{upsert:true,new:true})
        if(!updated) await User.findOneAndUpdate({_id:userId,active:true},{information:updated._id})
        sendResponse(res,200,true,updated,null,"Create UserInfo Success")
    }catch(err){
        next(err)
    }
}

//Get a userInfo
userInfoController.getAUserInfo=async(req,res,next)=>{
    const {userId} = req.access;
    const filter = {active:true};
    if(req.params.name) filter.name = req.params.name;
    else filter._id=userId;
    try{
        const userInfoFound = await User.findOne(filter).populate("information", "-_id -__v");
        if(userInfoFound===null) return res.status(400).json({ errors: [{ message: 'No user info be found!' }] }); 
        sendResponse(res,200,true, filterField(userInfoFound,showField),null,"Found list of user info success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = userInfoController