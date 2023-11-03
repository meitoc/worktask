const express= require("express")

const router = express.Router()
const {createColor, getAllColors, deleteColor, getColor,updateColor} = require("../controllers/color.controllers.js")
const { isAdminAuthenticated } = require("../auth/authorization.js")

//Read
/**
 * @route GET api/color/red
 * @description get a color
 * @access public
 */
router.get("/:name",getColor)

//Read
/**
 * @route GET api/color
 * @description get list of colors
 * filter by query:
 * name: name contain the string, exampe: "re" will return red, green
 * time: forward, backward
 * @access public
 */
router.get("/",getAllColors)

//Create
/**
 * @route POST api/color
 * @description create a color
 * @access admin
 */
router.post("/",isAdminAuthenticated,createColor)

//Delete color
/**
 * @route PUT api/color
 * @description update reference to a color
 * @access admin
 */
router.delete("/:name",isAdminAuthenticated,deleteColor)

//Update
/**
 * @route PUT api/color/delete-user/abc
 * @description delete reference to a color by user name
 * @access admin
 */
router.put("/:name",isAdminAuthenticated,updateColor)


//export
module.exports= router