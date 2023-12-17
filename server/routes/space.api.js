const express= require("express")

const router = express.Router()
const {createSpace, getAllSpaces, deleteSpace, getSpace,updateSpace , updateSpaces} = require("../controllers/space.controllers.js")
const {updateSpaceColor} = require("../controllers/space/colorSpace.controllers.js")
const {addSpaceTask, removeSpaceTask} = require("../controllers/space/taskSpace.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js")

//Read
/**
 * @route GET api/space/8289189999
 * @description get a space
 * @access owner user
 */
router.get("/id/:id",isAuthenticated, getSpace)

//Read
/**
 * @route GET api/space
 * @description get list of space
 * filter by query:
 * name: name contain the string, exampe: "i" will return "vip", "coming"
 * time: forward, backward
 * @access owner user
 */
router.get("/",isAuthenticated, getAllSpaces)

//Create
/**
 * @route POST api/space
 * @description create a space
 * @access owner user
 */
router.post("/",isAuthenticated, createSpace)

//Delete space
/**
 * @route PUT api/space
 * @description delete space
 * @access owner user
 */
router.delete("/id/:id",isAuthenticated,deleteSpace)

//Update
/**
 * @route PUT api/space/delete-user/abc
 * @description update new info fo a space
 * @access owner user
 * create new if dose not exit
 */
router.put("/id/:id",isAuthenticated,updateSpace)

//Update spaces order
/**
 * @route POST api/space
 * @description create a space
 * @access owner user
 */
router.put("/",isAuthenticated, updateSpaces)
/////////// Specificated Id for color

//Update
/**
 * @route PUT api/task/id/1234.../color
 * @description delete reference to a task by user name
 * @access user
 */
router.put("/id/:id/color",isAuthenticated,updateSpaceColor)

/////////// Specificated Id for task

//Update
/**
 * @route PUT api/task/id/1234.../task
 * @description delete reference to a task by user name
 * @access user
 */
router.put("/id/:id/task",isAuthenticated,addSpaceTask)

//Delete
/**
 * @route PUT api/task/id/1234.../task
 * @description delete reference to a task by user name
 * @access user
 */
router.delete("/id/:id/task",isAuthenticated,removeSpaceTask)

//export
module.exports= router