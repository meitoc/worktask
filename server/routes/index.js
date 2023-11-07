const { sendResponse, AppError}=require("../helpers/utils.js")
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome you to my website")
  // res.render('index', { title: 'Express' });
});

const accessRouter = require("./access.api.js")
router.use("/access",accessRouter)

const userInfoRouter = require("./userinfo.api.js")
router.use("/user-info",userInfoRouter)

const userRouter = require("./user.api.js")
router.use("/user",userRouter)

const colorRouter = require("./color.api.js")
router.use("/color",colorRouter)

const planRouter = require("./plan.api.js")
router.use("/plan",planRouter)

const userPlanRouter = require("./userplan.api.js")
router.use("/userplan",userPlanRouter)

const spaceRouter = require("./space.api.js")
router.use("/space",spaceRouter)

const taskRouter = require("./task.api.js")
router.use("/task",taskRouter)

module.exports = router;
