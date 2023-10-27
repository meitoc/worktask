const { sendResponse, AppError}=require("../helpers/utils.js")
const { param, body, validationResult } = require('express-validator');
const UserInfo = require("../models/UserInfo.js")
const User = require("../models/User.js")

const userInfoController={}
//Create a userInfo
userInfoController.updateAUserInfo=async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('name')
            .matches(/^[a-z][a-z0-9_]{4,}$/)
            .withMessage('Invalid name!')
            .run(req);
        await body('real_name').isEmpty().isString().withMessage('Invalid real_name!').run(req);
        await body('gender').isEmpty().isString().withMessage('Invalid gender!').run(req);
        await body('birthday').isEmpty().isString().withMessage('Invalid birthday!').run(req);
        await body('organization').isEmpty().isString().withMessage('Invalid organization!').run(req);
        await body('position').isEmpty().isString().withMessage('Invalid position!').run(req);
        await body('avatar').isEmpty().isString().withMessage('Invalid avatar!').run(req);
        await body('location').isEmpty().isString().withMessage('Invalid location!').run(req);
        await body('experiences').isEmpty().isString().withMessage('Invalid experiences!').run(req);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const name= req.params.name;
        const { real_name, gender,birthday,organization,position, avatar, location, experiences } = req.body;
        const newUserInfo = { real_name, gender,birthday,organization,position, avatar, location, experiences }
        const existUser = await User.findOne({name})
        if(existUser) {
            try{
                const updated= await UserInfo.findOneAndUpdate({_id:existUser._id},newUserInfo)
                sendResponse(res,200,true,{data:updated},null,"Create UserInfo Success")
            }catch(err){
                next(err)
            }
        }
        else return res.status(400).json({ errors: [{ msg: 'User unvalable!' }] });
    }catch(err){
        next(err)
    }
}

//Get a userInfo
userInfoController.getAUserInfo=async(req,res,next)=>{
    console.log(req.params.name)
    const filter = {name: req.params.name, active:true}
    try{
        const userInfoFound = await User.findOne(filter).populate("information");
        if(userInfoFound===null) return res.status(400).json({ errors: [{ msg: 'No user info be found!' }] }); 
        sendResponse(res,200,true,{data:userInfoFound.information},null,"Found list of user info success")
    }catch(err){
        next(err)
    }
}

//export
module.exports = userInfoController