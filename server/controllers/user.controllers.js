const bcrypt = require("bcryptjs")
const { sendResponse, AppError}=require("../helpers/utils.js")
const { param, body, validationResult } = require('express-validator');
const User = require("../models/User.js")
const UserInfo = require("../models/UserInfo.js")
const Access = require("../models/Access.js");
// const { response } = require("express");
const email = require("../email/email.js");

const {FRONTEND_URL} = process.env;

const userController={}
//Create a user
userController.createUser=async(req,res,next)=>{
    try{
        //check body by express-validator
        await body('name')
            .matches(/^[a-z][a-z0-9_]{4,}$/)
            .withMessage('Name must start with a letter and contain only lowercase letters, numbers, and underscores!')
            .run(req);
        await body('email').isEmail().withMessage('Invalid email!').run(req);
        await body('password')
            .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters!')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
            .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character!')
            .run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //secure password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(`${req.body.password}`, salt);
        
        
        const newUser = {
            name:req.body.name,
            email:req.body.email,
            active: false,
            password
        }
        const existUser = await User.findOne({$or:[{name:newUser.name},{email:newUser.email}]})
        if(existUser) 
        return res.status(400).json({ errors: [{ msg: 'User existed or unvalable!' }] });
    else try{
            //create UserInfo
            const createdInfo= await UserInfo.create({})
            newUser.information = createdInfo._id;
            //create User
            const createdUser= await User.create(newUser)
            //create Access
            const otp_string = await createdUser.generateFirst();
            const session = await createdUser.generateSession();
            const newAccess = {
                email_otp : encodeURIComponent(otp_string).replace(/\./g, '__'),
                email_otp_status : true,
                session,
                role: "user",
                user : createdUser._id
            };
            const createdAccess= await Access.create(newAccess)
            //send email contains otp
            const emailContent=`<a href="${FRONTEND_URL}/first-access/${newAccess.email_otp}"></a>`
            const sendEmail = await email.sendEmail("Email Authentication",emailContent,newUser.email);
            if(!sendEmail){
                //delete UserInfo
                const deleteIfo= await UserInfo.deleteOne({_id:createdInfo._id})
                //delete User
                const deleteUser= await User.deleteOne({_id:createdUser._id})
                //delete Access
                const deleteAccess = await Access.deleteOne({_id:createdAccess._id});
                return res.status(400).json({ errors: [{ msg: 'Try other email or try later!' }] });
            }
            //response with secure password
            const responseUser={
                name: newUser.name,
                email: newUser.email,
                password:"********",
                sent_email: sendEmail,
            }
            sendResponse(res,200,true,{data:responseUser},null,"Create User Success")
        }catch(err){
            next(err)
        };
    }catch(err){
        next(err)
    }
}

//Get a user
userController.getAUser=async(req,res,next)=>{
    const filter = {name: req.params.name, active:true}
    try{
        const userFound= req.query.info==="true" ?
        await User.findOne(filter).populate("information")
        :await User.find(filter);
        if(userFound===null) return res.status(400).json({ errors: [{ msg: 'No user be found!' }] }); 
        const filterredUser = req.query.info==="true" ?
            {name: userFound.name, email: userFound.email?userFound.email:"", phone:userFound.phone?userFound.phone:"", information: userFound.information?userFound.information:{}}
            : {name: userFound.name, email: userFound.email?userFound.email:"", phone:userFound.phone?userFound.phone:""};
        sendResponse(res,200,true,{data:filterredUser},null,"Found list of users success")
    }catch(err){
        next(err)
    }
}
//Get all user
userController.getAllUser=async(req,res,next)=>{
    const filter = {active:true}
    try{
        const userFound= req.query.info==="true" ?
        await User.find(filter).populate("information")
        :await User.find(filter);
        if(userFound===null) return res.status(400).json({ errors: [{ msg: 'No user be found!' }] }); 
        const filterredUser = req.query.info==="true" ?
            userFound.map(e=>{return {name: e.name, email: e.email?e.email:"", phone:e.phone?e.phone:"", information: e.information?e.information:{}}})
            : userFound.map(e=>{return {name: e.name, email: e.email?e.email:"", phone:e.phone?e.phone:""}});
        sendResponse(res,200,true,{data:filterredUser},null,"Found list of users success")
    }catch(err){
        next(err)
    }
}
//Update a user
userController.updateUserByName=async(req,res,next)=>{
    
    try{
        //check body by express-validator
        await param('name').notEmpty().withMessage('Empty user name!').run(req);
        if(req.body.email){//update email
            await body('email').isEmail().withMessage('Invalid email!').run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {real_name,
                gender,
                birthday,
                organization,
                position,
                avatar,
                location,
                experiences} = req.body;

            const name = req.params.name;
            //no secure now
            //add update for OTP and AccessSession
            const updated= await User.findOneAndUpdate({name},updateInfo)
            // const updated= await User.findOneAndUpdate({name,password},updateInfo)
            if(updated) {
                sendResponse(res,200,true,{data:{new_email}},null,"Update user success")
                // sendResponse(res,200,true,{data:{new_email:email}},null,"Send OTP")
            }
            else {
                //send an email for warning
                return res.status(400).json({ errors:[{"type": "field", "value": new_email, msg: "Invalid login info!", path: "password", location:"body"}] });
            }
        } else {//update password
            await body('password')
                .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters!')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
                .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character!')
                .run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const name = req.params.name;
            const new_password = req.body.password;
            const updateInfo = {new_password};
            //no secure now
            //add update for OTP and AccessSession
            const updated= await User.findOneAndUpdate({name},updateInfo)
            // const updated= await User.findOneAndUpdate({name,password},updateInfo)
            if(updated) {
                sendResponse(res,200,true,{data:{new_password}},null,"Update user success")
                // sendResponse(res,200,true,{data:{new_email:email}},null,"Send OTP")
            }
            else {
                //send an email for warning
                return res.status(400).json({ errors:[{"type": "field", "value": password, msg: "Invalid login info!", path: "password", location:"body"}] });
            }
        }
    }catch(err){
        next(err)
    }
}
//Delete user
userController.deleteUserByName=async(req,res,next)=>{
    try{
        //check body by express-validator
        await param('name').notEmpty().withMessage('Empty user name!').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const name = req.params.name;
        const updatedUser= await User.findOneAndUpdate({name},{active:false, name:"@"+name})
        //add update others collection later
        if(updatedUser){
            const updatedAccess = await Access.findOneAndUpdate({user: updatedUser._id}, {active:false})
            //hide updated for secure
            sendResponse(res,200,true,{},null,"Delete user success");
        }
        else return res.status(400).json({ errors: [{ msg: 'No matched data' }] });
    }catch(err){
        next(err)
    }
}
//export
module.exports = userController