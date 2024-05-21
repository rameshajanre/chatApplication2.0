const express = require("express")
const router = express.Router()
const messageController = require("../controller/messageController")
const auth = require("../middleware/authMiddleware")

router.get("/all-message/:chatId",auth.protect,messageController.allMessages)
router.post("/send-message",auth.protect,messageController.sendMessage)


module.exports = router