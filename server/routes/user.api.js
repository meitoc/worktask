const express= require("express")
const router = express.Router()
const {createUser, getAllUser, getAUser, updateUser ,deleteUserByName} = require("../controllers/user.controllers.js")

const { isAuthenticated,isAdminAuthenticated } = require("../auth/authorization.js")

//Read
/**
 * @route GET api/user/
 * @description get list of users
 * @access secure: admin,user
 */
router.get("/",isAuthenticated,getAllUser)

//Read
/**
 * @route GET api/user/abc
 * @description get list of users
 * @access secure: admin, user
 */
router.get("/:name",isAuthenticated,getAUser)

//Create
/**
 * @route POST api/user
 * @description create a user
 * @access public
 * all change have been via OTP auth
 */
router.post("/",createUser)

//Update
/**
 * @route PUT api/user/
 * @description secure: admin, user
 * change this when build a bot
 * only update password
 */
router.put("/", isAuthenticated,updateUser )
//Delete
/**
 * @route DELETE api/user/abc
 * @description delete a user
 * @access secure: admin, user
 * change this when build a bot
 * only bot can change
 * all change have been via OTP auth
 */
router.delete("/:name",isAdminAuthenticated,deleteUserByName)

//=============

const {getAUserInfo} = require("../controllers/userinfo.controllers.js")

//Read
/**
 * @route GET api/user/abc
 * @description get a user info
 * @access secure: admin, user
 */
router.get("/:name/info",isAuthenticated,getAUserInfo)

//export
module.exports= router;