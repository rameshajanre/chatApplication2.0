const Chat = require("../model/chatModel");
const User = require("../model/userModel");

const chatAccess = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("userId=", userId, "req.user=", req.user._id);
    if (!userId) {
      return res.status(400).json({
        status: "Failed",
        message: "User not found..",
      });
    }
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
    }
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    return res.status(200).json(FullChat);
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const fatchChats = async(req,res)=>{
    try {
        console.log("req.user=",req.user._id);
       const userChat = await Chat.find({users:{$elemMatch:{ $eq: req.user._id }}})
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        return res.status(200).json({
            status:"success",
            data:results
        }) 
      });
    } catch (error) {
        return res.status(500).json({
            error:"Error",
            message:error.message
           })  
    }
}

const groupChats = async(req,res)=>{
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please Fill all the feilds" });
          }
        let users = JSON.parse(req.body.users);
        if (users.length < 2) {
            return res
              .status(400)
              .send("More than 2 users are required to form a group chat");
          }
          users.push(req.user);

          const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
          });
      
          const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
      
        return res.status(200).json(fullGroupChat);
    } catch (error) {
        return res.status(500).json({
            Error:"Error",
            message:error.message
           })  
    }
}

const updateGroupName = async(req,res)=>{
    try {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          {
            chatName: chatName,
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      
        if (!updatedChat) {
         return res.status(404).json({message:"Chat Not Found"});
        } else {
         return res.status(200).json(updatedChat);
        } 
    } catch (error) {
        return res.status(500).json({
            Error:"Error",
            message:error.message
           })   
    }
}

const removeFromGroup = async(req,res)=>{
    try {
        const { chatId, userId } = req.body;

        // check if the requester is admin
      
        const removed = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      
        if (!removed) {
          return res.status(404).json({
            message:"Chat Not Found"
          });
         
        } else {
         return res.status(200).json({
            message:"Remove Successfully",
            data: removed
        });
        } 
    } catch (error) {
        return res.status(500).json({
            Error:"Error",
            message:error.message
           })  
    }
}

const addToGroup = async(req,res)=>{
    try {
        const { chatId, userId } = req.body;

        // check if the requester is admin
      
        const added = await Chat.findByIdAndUpdate(
          chatId,
          {
            $push: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      
        if (!added) {
         return res.status(404).json({
            message:"Chat Not Found"
         });
        } else {
         return res.status(200).json({
            message:"user add successfully",
            data:added
        });
        } 
    } catch (error) {
        return res.status(500).json({
            Error:"Error",
            message:error.message
           })   
    }
}


module.exports = { chatAccess,fatchChats,groupChats,updateGroupName,removeFromGroup,addToGroup};
