const { sendResponse, AppError}=require("../helpers/utils.js")
const { param, body, validationResult } = require('express-validator');
const User = require("../models/User.js")
const Access = require("../models/Access.js")
const bcrypt = require('bcryptjs')
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const accessController={}

//Create a first access for a user
accessController.getFirstAccess=async(req,res,next)=>{
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
                sendResponse(res,200,true,{data:{session}},null,"Authenticate Account Success")
            }catch(err){
                next(err)
            };
        }
    }catch(err){
        next(err)
    }
}

//Login
accessController.getLogin = async (req,res,next) => {
    try{
        //check param by express-validator
        if(req.body.name)
        await body('name')
            .matches(/^[a-z][a-z0-9_]{4,}$/)
            .withMessage('Name must start with a letter and contain only lowercase letters, numbers, and underscores!')
            .run(req);
        else await body('email').isEmail().withMessage('Invalid email!').run(req);
        await body('password')
            .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters!')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
            .withMessage('Invalid password!')
            .run(req);;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {name,email,password} =req.body;
        //find and update Access
        const userFound = name?
        await User.findOne({name, active:true})
        : await User.findOne({email, active:true});
        if(!userFound) return res.status(400).json({ errors: [{ msg: 'Invalid name or email!' }] });
        const accessFound = await Access.findOne({user: userFound._id})
        console.log("accessFound",accessFound)
        if(!accessFound) return res.status(400).json({ errors: [{ msg: 'Something wrong! Contact to admin now!' }] });
            const currentTime = new Date();
            const lockedFrom = accessFound.locked_from
            let accessTriedTime = accessFound.tried_time;
            if(accessTriedTime>2){
                const overTimeLocked = (Math.floor((currentTime.getTime() - lockedFrom.getTime())/60000)>=5)
                if(!overTimeLocked) return res.status(400).json({ errors: [{ msg: 'Locked login!' }] });
                accessTriedTime = 0;
            }
            const passwordMatched = await bcrypt.compare(password, userFound.password)
            if(!passwordMatched) {
                const updatedAccess = await Access.findOneAndUpdate({user:userFound._id},{tried_time:(accessTriedTime+1),locked_from:currentTime})
                console.log(updatedAccess)
                return res.status(400).json({ errors: [{ msg: 'Wrong password!' }] });
            }
            const session = await userFound.generateSession();
            const updatedAccess = await Access.findOneAndUpdate({user:userFound._id},{tried_time:0,session})
            if(!updatedAccess) return res.status(400).json({ errors: [{ msg: 'Something wrong! Try again later!' }] });
            sendResponse(res,200,true,{data:{session}},null,"Login Success")
        
    }catch(err){
        next(err)
    }
}
//Logout
accessController.getLogout=async(req,res,next)=>{
    try{
        //check name by express-validator
        //2 lines below for testing
        const {userId, role} = req.access;
        console.log(role)
        
        //find and update Access
        const accessFound = await Access.findOne({user:userId});
        const newSession = await accessFound.generateLogoutSession();
        const updatedAccess = await Access.findOneAndUpdate({user:userId},{session:newSession})
        if(!updatedAccess)  return res.status(400).json({ errors: [{ msg: 'Invalid session3!' }] });
        sendResponse(res,200,true,{data:{}},null,"Logout Success")
        
    }catch(err){
        next(err)
    }
}

//export
module.exports = accessController