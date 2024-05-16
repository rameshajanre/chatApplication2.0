const express = require("express")
const router = express.Router()
const chatController = require("../controller/chatController")
const auth = require("../middleware/authMiddleware")

router.post("/access-create",auth.protect,chatController.chatAccess)
router.get("/fatch-chats",auth.protect,chatController.fatchChats)
router.post("/group-chats",auth.protect,chatController.groupChats)
router.put("/group-name-update",auth.protect,chatController.updateGroupName)
router.post("/remove-from-group",auth.protect,chatController.removeFromGroup)
router.post("/add-user",auth.protect,chatController.addToGroup)

module.exports = router