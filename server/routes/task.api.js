const express= require("express")

const router = express.Router()
const { createRootTask, getOwnTasks, getMemberTasks,  postTaskList,   getTask, updateTask, createTask, deleteTask } = require("../controllers/task.controllers.js")
const { updateTaskColor } = require("../controllers/task/colorTask.controllers.js")
const { addUser,removeUser } = require("../controllers/task/userTask.controllers.js")
const { addComment,getComments,deleteComment } = require("../controllers/task/commentTask.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js")
const { memberAddMember } = require("../controllers/task/memberAddMember.controllers.js")

//Read list of task which user own or being root nearest manager

//Create a task on root
/**
 * @route POST api/task/member 
 * @description get list f tasks
 * @access user
 */
router.post("/",isAuthenticated, createRootTask)

//Read own task
/**
 * @route GET api/task/member
 * @description get list f tasks
 * @access user
 */
router.get("/owner",isAuthenticated, getOwnTasks)

//Read task which is member
/**
 * @route GET api/task/member
 * @description get list of tasks
 * @access user
 */
router.get("/member",isAuthenticated, getMemberTasks)
//Read task list
/**
 * @route GET api/task/list
 * @description get list of tasks
 * @access user
 */
router.post("/get-list",isAuthenticated, postTaskList)

/////////// Specificated Id for member_add_member

//Update
/**
 * @route PUT api/task/id/1234.../member_add_member
 * @description add an owner
 * @access user
 */
router.put("/id/:id/member-add-member",isAuthenticated,memberAddMember)

/////////// Specificated Id for comment

//Create
/**
 * @route POST api/task/id/1234.../comment
 * @description create a comment
 * @access user
 */
router.post("/id/:id/comment",isAuthenticated,addComment)

//Get acomment
/**
 * @route GET api/task/id/1234.../comment
 * @description add a comment
 * @access user
 */
router.get("/id/:id/comment",isAuthenticated,getComments)

//Delete
/**
 * @route DELETE api/task/id/1234.../owner
 * @description delete a comment
 * @access manager or owner of task
 */
router.delete("/id/:id/comment",isAuthenticated,deleteComment)

/////////// Specificated Id for color

//Update
/**
 * @route PUT api/task/id/1234.../owner
 * @description add an owner
 * @access user
 */
router.put("/id/:id/user",isAuthenticated,addUser)

//Delete
/**
 * @route DELETE api/task/id/1234.../owner
 * @description delete an owner
 * @access user
 */
router.delete("/id/:id/user",isAuthenticated,removeUser)

/////////// Specificated Id for color

//Update
/**
 * @route PUT api/task/id/1234.../color
 * @description delete reference to a task by user name
 * @access user
 */
router.put("/id/:id/color",isAuthenticated,updateTaskColor)

/////////// Specificated Id
//Create
/**
 * @route POST api/task/
 * @description create a task
 * @access user
 */
router.post("/id/:id",isAuthenticated,createTask)

//For special task
//Read
/**
 * @route GET api/task/id/123727272...
 * @description get a task
 * @access user
 */
router.get("/id/:id",isAuthenticated,getTask)

//Update
/**
 * @route PUT api/task/delete-user/abc
 * @description delete reference to a task by user name
 * @access user
 */
router.put("/id/:id",isAuthenticated,updateTask)

//Soft delete task
/**
 * @route PUT api/task/delete-user/abc
 * @description delete reference to a task by user name
 * @access public
 */
router.delete("/id/:id",isAuthenticated,deleteTask)


//export
module.exports= router