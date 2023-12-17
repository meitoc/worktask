const { sendResponse, AppError}=require("../helpers/utils.js")
const fileController={}
const UserInfo = require("../models/UserInfo.js")
const User = require("../models/User.js");
const {AWS_PUBLIC_URL } = process.env;

fileController.updateAvatar = async(req,res,next)=>{
    try{
        const {userId}= req.access;
        const timestamp = Date.now();
        const newUserInfo = {avatar:`${AWS_PUBLIC_URL}/avatar/${userId}.jpg?timestamp=${timestamp}`}

        const foundUser = await User.findOne({_id:userId,active:true},"information")
        const updated= await UserInfo.findOneAndUpdate({_id:foundUser.information},newUserInfo,{upsert:true,new:true})
        if(!updated) await User.findOneAndUpdate({_id:userId,active:true},{information:updated._id})
        console.log(updated)
        sendResponse(res,200,true,updated,null,"Update UserInfo Success")
    }catch(err){
        next(err)
    }
}
//export
module.exports = fileController