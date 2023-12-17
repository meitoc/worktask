const express= require("express")
const router = express.Router()
const {getFirstAccess, postLogin, getLogout, getCheck, postForgotPassword} = require("../controllers/access.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js")

//Request to first log in
/**
 * @route GET api/access/url-login/aajs8Jhani1JJ
 * @description access to first login
 * @access public but just only by who received the otp email
 */
router.get("/url-login/:otp_string",getFirstAccess)

//Request for normal log in
/**
 * @route POST api/access/login
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

//Request for create a access url for log in
/**
 * @route POST api/access/forgot-password
 * @description request to log in
 * @access public
 */
router.post("/forgot-password",postForgotPassword)

//export
module.exports= router;