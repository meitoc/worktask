const express= require("express")
const router = express.Router()
const {createUser, getAllUser, getAUser, updateUserByName ,deleteUserByName} = require("../controllers/user.controllers.js")



//Read
/**
 * @route GET api/user/
 * @description get list of users
 * @access secure: admin, user
 */
router.get("/",getAllUser)

//Read
/**
 * @route GET api/user/abc
 * @description get list of users
 * @access secure: admin
 */
router.get("/:name",getAUser)

//Create
/**
 * @route POST api/user/abc
 * @description create a user
 * @access secure: admin, user
 * change this when build a bot
 * only bot can change
 * all change have been via OTP auth
 */
router.post("/",createUser)
//Update
/**
 * @route PUT api/user/abc
 * @description secure: admin, user
 * change this when build a bot
 * only bot can change
 * all change have been via OTP auth
 */
router.put("/:name",updateUserByName )
//Delete
/**
 * @route DELETE api/user/abc
 * @description delete a user
 * @access secure: admin, user
 * change this when build a bot
 * only bot can change
 * all change have been via OTP auth
 */
router.delete("/:name",deleteUserByName)

//=============

const {getAUserInfo, updateAUserInfo} = require("../controllers/userinfo.controllers.js")

//Read
/**
 * @route GET api/user/abc
 * @description get a user info
 * @access secure: admin, user
 */
router.get("/:name/info",getAUserInfo)

//Update /create
/**
 * @route PUT api/user/abc
 * @description update a user info
 * @access secure: admin, user
 */
router.put("/:name/info",updateAUserInfo )

//export
module.exports= router;