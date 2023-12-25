const express= require("express")

const router = express.Router()
const { getNotify } = require("../controllers/notify.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js");
//Post a file
/**
 * @route POST api/file/avatar
 * @description create a file
 * @access user
 */
router.get("/",isAuthenticated,getNotify)

//export
module.exports= router