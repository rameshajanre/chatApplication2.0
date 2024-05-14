const mongoose = require("mongoose")

const connectionDB =  mongoose.connect("mongodb://127.0.0.1:27017/chat_App4",
{ 
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(()=>{
    console.log("mongodb has connected successfully..")
}).catch(error=>{
    console.log("error=",error)
})

module.exports = connectionDB