const express= require("express")

const router = express.Router()
const { getNotify } = require("../controllers/notify.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js");
//Get a list of notify
/**
 * @route POST api/file/avatar
 * @description create a file
 * @access user
 */
router.get("/",isAuthenticated,getNotify)

//export
module.exports= router