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
router.delete("/id/:id/comment/:commentId",isAuthenticated,deleteComment)

/////////// Specificated Id for color

//Update
/**
 * @route PUT api/task/id/1234.../user
 * @description add a user
 * @access user
 */
router.put("/id/:id/user",isAuthenticated,addUser)

//Delete
/**
 * @route DELETE api/task/id/1234.../owner
 * @description delete a user
 * @access user
 */
router.delete("/id/:id/user/:user",isAuthenticated,removeUser)

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

////////////////////////
const { createFileRecord, responsePresignedUrl, responseFileList, responseFileDetail, responseFileDeleted } = require("../controllers/task/fileTask.controllers.js")
const { createPresignedUrlDownload, createPresignedUrlUpload, checkAWSFile, deleteAWSFile } = require("../aws/awsFile.js");
const { taskAccessCheck } = require("../validators/file.validators.js");

//Get a file url to dowwnload
/**
 * @route GET api/file/id/1234.../download
 * @description download a file
 * @access user
 */
router.post("/id/:id/file/download",isAuthenticated,taskAccessCheck,createPresignedUrlDownload,responsePresignedUrl)

//Post a file // upload file step 1
/**
 * @route POST api/file/task/1234.../upload
 * @description create a file
 * @access user
*/
router.post("/id/:id/file/upload",isAuthenticated,taskAccessCheck,createFileRecord,createPresignedUrlUpload,responsePresignedUrl)

//Delete a file
/**
 * @route GET api/file/id/1234.../delete
 * @description delete a file
 * @access user
 */
router.post("/id/:id/file/delete",isAuthenticated,taskAccessCheck,deleteAWSFile,responseFileDeleted)

//Check a file after upload, this step must be done to active the file // upload file step 3 (step 2 is on client-AWS side)
/**
 * @route PUT api/file/task/1234...
 * @description download a file
 * @access user
 */
router.put("/id/:id/file",isAuthenticated,taskAccessCheck,checkAWSFile,responseFileDetail)

//Get file list of task
/**
 * @route GET api/file/task/1234...
 * @description download a file
 * @access user
 */
router.get("/id/:id/file/",isAuthenticated,taskAccessCheck,responseFileList)

//export
module.exports= router