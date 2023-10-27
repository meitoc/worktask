const express= require("express")

const router = express.Router()
const {createUserPlan, getAllUserPlans, deleteUserPlan, getUserPlan,updateUserPlan} = require("../controllers/userplan.controllers.js")

//Read
/**
 * @route GET api/userplan/8289189999
 * @description get a user plan
 * @access admin, owner user
 */
router.get("/:id",getUserPlan)

//Read
/**
 * @route GET api/userplan
 * @description get list of user plans
 * filter by query:
 * code: code contain the string, exampe: "i" will return "vip", "coming"
 * time: forward, backward
 * @access admin, owner user
 */
router.get("/",getAllUserPlans)

//Create
/**
 * @route POST api/userplan
 * @description create a user plan
 * @access admin only
 */
router.post("/",createUserPlan)

//Delete user plan
/**
 * @route PUT api/userplan
 * @description delete user plan
 * @access admin only
 */
router.delete("/:id",deleteUserPlan)

//Update
/**
 * @route PUT api/userplan/delete-user/abc
 * @description update new info fo a user plan
 * @access admin only
 * create new if dose not exit
 */
router.put("/:id",updateUserPlan)


//export
module.exports= router