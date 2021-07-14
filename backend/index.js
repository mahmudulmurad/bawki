const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
const app = express()
dotenv.config();
const userRouter = require('./routes/userRouter');


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},() => {console.log("Connected to MongoDB")})

app.use(express.json());
app.use(cors())
app.use(userRouter)

app.listen(process.env.PORT, ()=>{
    console.log('Express server is running on port : '+ process.env.PORT)
})