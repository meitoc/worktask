const { sendResponse, AppError}=require("../helpers/utils.js")
const { param, body, validationResult } = require('express-validator');
const User = require("../models/User.js")
const Access = require("../models/Access.js")

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const userController={}

//Create a user
userController.getFirstAccess=async(req,res,next)=>{
    try{
        //check param by express-validator
        await param('otp_string').notEmpty().withMessage('Invalid access URL!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {otp_string} =req.params;
        
        //find and update Access
        const accessFound = await Access.findOneAndUpdate({email_otp: otp_string, email_otp_status:true},{email_otp_status:false})
        if(!accessFound) return res.status(400).json({ errors: [{ msg: 'Access string is end of service!' }] });
        else{
            try{
                //update User
                const userFound= await User.findOneAndUpdate({_id:accessFound.user}, {active:true})
                const session= await userFound.generateSession();
                const updatedAccess= await Access.findOneAndUpdate({user:accessFound.user}, {session})
                if(!updatedAccess) return res.status(400).json({ errors: [{ msg: 'Please login by password!' }] });
                sendResponse(res,200,true,{data:{session}},null,"Create User Success")
            }catch(err){
                next(err)
            };
        }
    }catch(err){
        next(err)
    }
}

// //Login
// userController.getLogin=async(req,res,next)=>{}
// //Logout
// userController.getLogout=async(req,res,next)=>{}

//export
module.exports = userController