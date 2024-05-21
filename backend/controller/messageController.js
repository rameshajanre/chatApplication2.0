const asyncHandler = require('express-async-handler');
const Message = require('../model/messageModel');
const User = require('../model/userModel');
const Chat = require('../model/chatModel');

// Fetch all messages for a chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
   return res.json(messages);
  } catch (error) {
    return res.status(500).json({
        Error:"Error",
        message:error.message
       }) 
  }
});

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      let message = await Message.create(newMessage);
  
      message = await Message.findById(message._id)
        .populate("sender", "name pic")
        .populate("chat")
        .populate({
          path: "chat.users",
          select: "name pic email"
        });
  
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  
     return res.json(message);
    } catch (error) {
        return res.status(500).json({
            Error:"Error",
            message:error.message
        }) 
    }
  });
  

module.exports = { allMessages, sendMessage };
