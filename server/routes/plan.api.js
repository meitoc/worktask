const express= require("express")

const router = express.Router()
const {createPlan, getAllPlans, deletePlan, getPlan,updatePlan} = require("../controllers/plan.controllers.js")

//Read
/**
 * @route GET api/plan/red
 * @description get a plan
 * @access public
 */
router.get("/:code",getPlan)

//Read
/**
 * @route GET api/plan
 * @description get list of plans
 * filter by query:
 * code: code contain the string, exampe: "i" will return "vip", "coming"
 * time: forward, backward
 * @access public
 */
router.get("/",getAllPlans)

//Create
/**
 * @route POST api/plan
 * @description create a plan
 * @access admin
 */
router.post("/",createPlan)

//Delete plan
/**
 * @route PUT api/plan
 * @description delete plan
 * @access admin
 */
router.delete("/:code",deletePlan)

//Update
/**
 * @route PUT api/plan/delete-user/abc
 * @description update new info fo a plan
 * @access admin
 */
router.put("/:code",updatePlan)


//export
module.exports= router