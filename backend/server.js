const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");
const cors = require("cors");
const {writeFile} = require("fs")

dotenv.config();
require("./mongoDbConfig/dbConfig");

const app = express();
app.use(express.json()); // to accept JSON data

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Routes
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => console.log(`Server running on PORT ${PORT}`)
);

// Configure socket.io
const io = require("socket.io")(server, {
  pingTimeout: 80000,
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log("Chat=",chat.users);
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      console.log("user inside of for loop=",newMessageRecieved.sender._id)
      if (user == newMessageRecieved.sender._id) return;
      console.log(`Emitting message to user ID: ${user}`);
      socket.in(user).emit("message recieved", newMessageRecieved);
      console.log("socket emit to user..")
    });
  
  });

  socket.on("upload", (file, callback) => {
    console.log("Image upload connection=", file);

    const buffer = Buffer.from(new Uint8Array(file));

    writeFile("uploadImages", buffer, (err) => {
      if (err) {
        console.error("File write error:", err);
        callback({ message: "failure" });
      } else {
        console.log("File successfully written");
        callback({ message: "success" });
      }
    })
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
