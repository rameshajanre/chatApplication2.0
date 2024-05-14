const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")

router.post("/user-create",userController.userRegister)
router.post("/user-login",userController.userLogin)

module.exports = router