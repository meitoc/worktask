const express= require("express")
const router = express.Router()
const {getFirstAccess, getLogin, getLogout} = require("../controllers/access.controllers.js")
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
router.get("/login",getLogin)

//Request for normal login
/**
 * @route GET api/access/logout
 * @description request log out
 * @access admin, user
 */
router.get("/logout", isAuthenticated, getLogout)

//export
module.exports= router;