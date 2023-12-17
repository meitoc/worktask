const { sendResponse, AppError}=require("../helpers/utils.js")
const { param, body, validationResult } = require('express-validator');
const User = require("../models/User.js")
const Access = require("../models/Access.js")
const bcrypt = require('bcryptjs');
const { filterField } = require("../tools/filterData.js");
const email = require("../email/email.js");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const showField = {name:1,email:1,phone:1,information:1}
const accessController={}

const {FRONTEND_URL} = process.env;

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
        const accessFound = await Access.findOneAndUpdate({email_otp: otp_string, email_otp_status:true},{email_otp_status:false,active:true})
        if(!accessFound) return res.status(400).json({ errors: [{ message: 'Access string is end of service!' }] });
        else{
            try{
                //update User
                const userFound= await User.findOneAndUpdate({_id:accessFound.user}, {active:true})
                const session= await userFound.generateSession();
                const updatedAccess= await Access.findOneAndUpdate({user:accessFound.user}, {session})
                if(!updatedAccess) return res.status(400).json({ errors: [{ message: 'Please login by password!' }] });
                sendResponse(res,200,true,{session},null,"Authenticate Account Success")
            }catch(err){
                next(err)
            };
        }
    }catch(err){
        next(err)
    }
}

//Login
accessController.postLogin = async (req,res,next) => {
    try{
        //check param by express-validator
        console.log(req.body)
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
        await User.findOne({name, active:true}).populate("information","-_id -__v")
        : await User.findOne({email, active:true}).populate("information","-_id -__v");
        if(!userFound) return res.status(400).json({ errors: [{ message: 'Invalid name or email!' }] });
        const accessFound = await Access.findOne({user: userFound._id})
        console.log("accessFound",accessFound)
        if(!accessFound) return res.status(400).json({ errors: [{ message: 'Something wrong! Contact to admin now!' }] });
            const currentTime = new Date();
            const lockedFrom = accessFound.locked_from
            let accessTriedTime = accessFound.tried_time;
            if(accessTriedTime>2){
                const overTimeLocked = (Math.floor((currentTime.getTime() - lockedFrom.getTime())/60000)>=5)
                if(!overTimeLocked) return res.status(400).json({ errors: [{ message: 'Locked login!' }] });
                accessTriedTime = 0;
            }
            const passwordMatched = await bcrypt.compare(password, userFound.password)
            if(!passwordMatched) {
                const updatedAccess = await Access.findOneAndUpdate({user:userFound._id},{tried_time:(accessTriedTime+1),locked_from:currentTime})
                console.log(updatedAccess)
                return res.status(400).json({ errors: [{ message: 'Wrong password!' }] });
            }
            const session = await userFound.generateSession();
            const updatedAccess = await Access.findOneAndUpdate({user:userFound._id},{tried_time:0,session})
            if(!updatedAccess) return res.status(400).json({ errors: [{ message: 'Something wrong! Try again later!' }] });
            sendResponse(res,200,true,{session, data:filterField(userFound,showField) },null,"Login Success")
        
    }catch(err){
        next(err)
    }
}
//Check token
accessController.getCheck=async(req,res,next)=>{
    try{
        //check name by express-validator
        const {userId, role} = req.access;
        console.log(role)
        
        //find and update Access
        if(!userId)  return res.status(400).json({ errors: [{ message: 'Invalid session!' }] });
        sendResponse(res,200,true,{data:{}},null,"Logged in")
        
    }catch(err){
        next(err)
    }
}
//Logout
accessController.getLogout=async(req,res,next)=>{
    try{
        //check name by express-validator
        const {userId, role} = req.access;
        console.log(role)
        
        //find and update Access
        const accessFound = await Access.findOne({user:userId});
        const newSession = await accessFound.generateLogoutSession();
        const updatedAccess = await Access.findOneAndUpdate({user:userId},{session:newSession})
        if(!updatedAccess)  return res.status(400).json({ errors: [{ message: 'Invalid session!' }] });
        sendResponse(res,200,true,{data:{}},null,"Logout Success")
        
    }catch(err){
        next(err)
    }
}

//Forrgot password
accessController.postForgotPassword=async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('email').isEmail().withMessage('Invalid email!').run(req);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const targetEmail = req.body.email;
        const filter = {
            email:targetEmail,
            active: true
        }
        const existUser = await User.findOne(filter)
        if(!existUser) return res.status(400).json({ errors: [{ message: 'User is not exist!' }] });
        else try{
            const otp_string = await existUser.generateFirst();
            const session = await existUser.generateSession();
            const newAccess = {
                email_otp : encodeURIComponent(otp_string).replace(/\./g, '__'),
                email_otp_status : true,
                session:session
            };
            const changedAccess= await Access.findOneAndUpdate({user:existUser._id},newAccess)
            if(!changedAccess) return res.status(400).json({ errors: [{ message: 'User is not exist!' }] });
            //send email contains otp
            const emailContent=`
            <div>
            <p>Welcome you to task.meitoc.net</p>
            </div>
            <div>
            <a href="${FRONTEND_URL}/url-login/${newAccess.email_otp}">CLICK HERE TO ACCESS YOUR ACCOUNT.</a>
            </div>`
            const sendEmail = await email.sendEmail("Email Authentication",emailContent,targetEmail);
            if(!sendEmail){
                return res.status(400).json({ errors: [{ message: 'Try other email or try later!' }] });
            }
            // response with secure password
            const responseUser={
                email: targetEmail,
                sent_email: true,
                test: `${FRONTEND_URL}/url-login/${newAccess.email_otp}`
            }
            sendResponse(res,200,true,{data:responseUser},null,"Create User Success")
        }catch(err){
            next(err)
        };
    }catch(err){
        next(err)
    }
}
//export
module.exports = accessController