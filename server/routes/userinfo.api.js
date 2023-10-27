const express= require("express")
const router = express.Router()
const {getAUserInfo, updateAUserInfo} = require("../controllers/userinfo.controllers.js")

//Read
/**
 * @route GET api/user/abc
 * @description get a user info
 * @access secure: admin, user
 */
router.get("/",getAUserInfo)

//Update /create
/**
 * @route PUT api/user/abc
 * @description update a user info
 * @access secure: admin, user
 */
router.put("/",updateAUserInfo )

//export
module.exports= router;