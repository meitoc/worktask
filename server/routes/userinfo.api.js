const express= require("express")
const router = express.Router()
const {getAUserInfo, updateAUserInfo} = require("../controllers/userinfo.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js")

//Read by a use who logged in
/**
 * @route GET api/user/abc
 * @description get a user info
 * @access secure: admin, user
 */
router.get("/",isAuthenticated, getAUserInfo)

//Update /create
/**
 * @route PUT api/user/abc
 * @description update a user info
 * @access only own user
 */
router.put("/",isAuthenticated,updateAUserInfo )

//export
module.exports= router;