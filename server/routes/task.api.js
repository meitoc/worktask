const express= require("express")

const router = express.Router()
const {addReference,deleteReference,createTask, getAllTasks,deleteTask} = require("../controllers/task.controllers.js")

//Read
/**
 * @route GET api/task
 * @description get list of tasks
 * @access public
 */
router.get("/",getAllTasks)
//Create
/**
 * @route POST api/task
 * @description create a task
 * @access public
 */
router.post("/",createTask)

//Delete task
/**
 * @route PUT api/task
 * @description update reference to a task
 * @access public
 */
router.delete("/",deleteTask)
//Update
/**
 * @route PUT api/task
 * @description update reference to a task
 * @access public
 */
router.put("/add-user",addReference)
//Update
/**
 * @route PUT api/task
 * @description update reference to a task
 * @access public
 */
router.put("/delete-user",deleteReference)

//export
module.exports= router