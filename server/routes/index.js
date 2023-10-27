const { sendResponse, AppError}=require("../helpers/utils.js")
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome you to my website")
  // res.render('index', { title: 'Express' });
});

router.get("/template/:test", async(req,res,next)=>{
  const { test } = req.params
  try{
      //turn on to test error handling
      if(test==="error"){
      throw new AppError(401,"Access denied","Authentication Error")
      }else{
      sendResponse(res,200,true,{data:"template"},null,"template success")
      }
  }catch(err){
      next(err)
  }
})


const accessRouter = require("./access.api.js")
router.use("/access",accessRouter)

// const userInfoRouter = require("./userinfo.api.js")
// router.use("/user/:name/info",userInfoRouter)

const userRouter = require("./user.api.js")
router.use("/user",userRouter)
//ok

const colorRouter = require("./color.api.js")
router.use("/color",colorRouter)
//ok

const planRouter = require("./plan.api.js")
router.use("/plan",planRouter)
//ok

const userPlanRouter = require("./userplan.api.js")
router.use("/userplan",userPlanRouter)
//ok

// const spaceRouter = require("./space.api.js")
// router.use("/space",spaceRouter)

const taskRouter = require("./task.api.js")
router.use("/task",taskRouter)

module.exports = router;
