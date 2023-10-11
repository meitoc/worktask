const express= require("express")
const router = express.Router()
const {createUser, getUserInfo, updateUserByName ,deleteUserByName} = require("../controllers/user.controllers.js")

//Read
/**
 * @route GET api/user
 * @description get list of users
 * @access public
 */
router.get("/:name",getUserInfo)
router.get("/",getUserInfo)
//Create
/**
 * @route POST api/user
 * @description create a user
 * @access secure
 */
router.post("/",createUser)
//Update
/**
 * @route PUT api/user
 * @description update a user
 * @access secure
 */
router.put("/:name",updateUserByName )
//Delete
/**
 * @route DELETE api/user
 * @description delet a user
 * @access secure
 */
router.delete("/:name",deleteUserByName)

//export
module.exports= router;