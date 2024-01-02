const User = require("../models/User.js")
const Access = require("../models/Access.js")
const UserInfo = require("../models/UserInfo.js")
const { sendResponse, AppError}=require("../helpers/utils.js")
// const { param, body, validationResult } = require('express-validator');
const {google} = require('googleapis');
const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT_URL} = process.env;

const googleLoginController={}


googleLoginController.postGoogleLogin = async (req,res,next) => {
  try{
    const { access_token, authuser,expires_in,prompt,scope, token_type} = req.body;
    console.log({ access_token, authuser,expires_in,prompt,scope, token_type});
    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({access_token});
    
    const people = google.people({ version: 'v1', auth: oauth2Client });
    const response = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    });
    if(response){
      const userInfos = response.data;
      const userRealName = userInfos.names[0].unstructuredName;
      const email = userInfos.emailAddresses[0].value;
      const verifiedEmail = userInfos.emailAddresses[0].metadata.verified;
      const userAvatar = userInfos.photos[0].url;
      if(!verifiedEmail) return res.status(400).json({ errors: [{ message: 'Try again later!' }] });
      //find and update Access
      const userFound = await User.findOne({email, active:true}).populate("information","-_id -__v");
      if(!userFound) {
        //create username by website rule
        let username = email.toLowerCase().split('@')[0].replace(/\./g, '');
        if (!isNaN(username.charAt(0))) {
          username = "u" + username;
        }
        let startNumber = (5-username.length > 0)? Math.pow(10,5-username.length):0;
        //create User Info
        const createdNewUserInfo = await UserInfo.create({real_name:userRealName,avatar:userAvatar})
        if(createdNewUserInfo){

          const checkAndCreateUser = async (name)=>{
            const userNameFound = await User.findOne({name, active:true});
            if(!userNameFound) {
              const createdNewUser = await User.create({name,email,active:true,information:createdNewUserInfo._id,password:" "});
              const email_otp = await createdNewUser.generateFirst();
              const session = await createdNewUser.generateSession();
              if(session && email_otp){
                console.log("SSSSSSSSSSS",session)
                const updatedAccess= await Access.create({user:createdNewUser._id, email_otp, email_otp_status:false, session,role:"user",active:true})
                if(!updatedAccess) return res.status(400).json({ errors: [{ message: 'Try again later!' }] });
                sendResponse(res,200,true,{session},null,"Login Success");
                return true
              }
            }
            return false;
          }
          
          for(let i = startNumber; i < startNumber+100000;i++){
            let newUserName = `${username}${startNumber===0?"":startNumber}`;
            //limit 1000time to do this step
            let newUser = await checkAndCreateUser(newUserName)
            if(newUser){
              break;
            }
          }
        } else {
          return res.status(400).json({ errors: [{ message: 'Try again later!' }] });
        }
      }else{
        const session= await userFound.generateSession();
        const updatedAccess= await Access.findOneAndUpdate({user:userFound._id,active:true}, {session})
        if(!updatedAccess) return res.status(400).json({ errors: [{ message: 'Please login by Google!' }] });
        sendResponse(res,200,true,{session},null,"Authenticate Account Success")
      }
    }
  }
  catch (error) {
    console.error('ERROR', error);
    res.status(500).send({ success: false, error: 'Đã xảy ra lỗi' });
  }
}

module.exports = googleLoginController