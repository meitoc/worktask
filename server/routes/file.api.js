const express= require("express")
const multer = require('multer');

const router = express.Router()
const { updateAvatar } = require("../controllers/file.controllers.js")
const { isAuthenticated } = require("../auth/authorization.js");
const { uploadPublicAWSFile } = require("../aws/awsFile.js");
const { avatarCheck } = require("../validators/file.validators.js");

const upload = multer().single('image');
//Post a file
/**
 * @route POST api/file/avatar
 * @description create a file
 * @access user
 */
router.post("/avatar",isAuthenticated,upload,avatarCheck,uploadPublicAWSFile,updateAvatar)

//export
module.exports= router