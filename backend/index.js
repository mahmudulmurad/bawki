const express = require('express')
const mongoose = require("mongoose")
const http = require('http')
const dotenv = require("dotenv")
const cors = require("cors")
const app = express()
dotenv.config()
const userRouter = require('./routes/userRouter')
const conversationRouter = require('./routes/conversationRouter')
const messageRouter = require('./routes/messageRouter')


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},() => {console.log("Connected to MongoDB")})

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(conversationRouter)
app.use(messageRouter)
app.use('/uploads', express.static('uploads'));

let server = http.createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
  })

let users = []
  
  const addUser = (userId, socketId) => {
    !users.some( user  => user.userId === userId) &&
      users.push({ userId, socketId })
  }
  
  const removeUser = (socketId) => {
    users = users.filter( user => user.socketId !== socketId)
  }
  
  const getUser = (receiverId) => {
    return users.find( user => user.userId === receiverId)
  }

io.on("connection", function (socket) {
     //when ceonnect
     console.log("a user connected.")
  
     //take userId and socketId from user
     socket.on("addUser",(userId) => {
       addUser(userId, socket.id)
       io.emit("getUsers", users)
     })
 
     //send and get message
     try {
        socket.on("sendMessage", async({ senderId, receiverId, text, messageImage }) => {
            const receiver = await getUser(receiverId)
            if(messageImage){
              io.to(receiver.socketId).emit("getMessage", {
                senderId,
                text,
                messageImage
              })
            }
            else{
              io.to(receiver.socketId).emit("getMessage", {
                senderId,
                text
              })
            }
            
          })
         
     } catch (error) {
         console.log(error.message)
     }
     
   
     //when disconnect
     socket.on("disconnect", () => {
       console.log("a user disconnected!")
       removeUser(socket.id)
       io.emit("getUsers", users)
     })
  })
  server.listen(process.env.PORT, ()=>{
    console.log('Express server is running on port : '+ process.env.PORT)
})