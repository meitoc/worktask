const express= require("express")
const router = express.Router()
const {postGoogleLogin} = require("../controllers/googleLogin.controllers.js")
// const { isAuthenticated } = require("../auth/authorization.js")

//Request for normal log in
/**
 * @route POST api/access/login
 * @description request to log in
 * @access public
 */
router.post("/",postGoogleLogin)

//export
module.exports= router;