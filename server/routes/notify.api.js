const express= require("express")

const router = express.Router()
const { getNotify, postNotify } = require("../controllers/notify.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js");
//Get a list of notify
/**
 * @route POST api/file/avatar
 * @description create a file
 * @access user
 */
router.get("/",isAuthenticated,getNotify)
//Post add user to read member list of a notify
/**
 * @route POST api/file/avatar
 * @description create a file
 * @access user
 */
router.post("/:notifyId",isAuthenticated,postNotify)

//export
module.exports= router