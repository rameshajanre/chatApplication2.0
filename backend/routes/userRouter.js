const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const auth = require("../middleware/authMiddleware")

router.post("/create",userController.userRegister)
router.post("/login",userController.userLogin)
router.get("/search",auth.protect,userController.userSearch)

module.exports = router