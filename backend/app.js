const express = require('express');
const mongoose = require('mongoose')
const User = require("./Routes/user-routes")
const cookieParser =require('cookie-parser')
const cors=require('cors');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());




app.use('/user',User)

mongoose.connect("mongodb+srv://mishal:dCW8HkOvpjvsL4Ra@cluster0.yvfbsak.mongodb.net/").then(()=>{
 app.listen(5000);
 console.log("Database is connected! Listening to localhost 5000 ") 
}).catch((err)=>{
  console.log(err)
})
