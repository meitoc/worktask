const express= require("express")
const router = express.Router()
const {getFirstAccess, postLogin, getLogout, getCheck} = require("../controllers/access.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js")

//Request to first log in
/**
 * @route GET api/access/first/aajs8Jhani1JJ
 * @description access to first login
 * @access public but just only by who received the otp email
 */
router.get("/first/:otp_string",getFirstAccess)

//Request for normal log in
/**
 * @route GET api/access/login
 * @description request to log in
 * @access public
 */
router.post("/login",postLogin)

//Request for check a session, later need filter ip or change it method for prevent hacking
/**
 * @route GET api/access/check
 * @description request log out
 * @access admin, user
 */
router.get("/check", isAuthenticated, getCheck)

//Request for normal login
/**
 * @route GET api/access/logout
 * @description request log out
 * @access admin, user
 */
router.get("/logout", isAuthenticated, getLogout)

//export
module.exports= router;