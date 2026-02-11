
import dotenv from "dotenv"
import mongoose from "mongoose";
import connectDB from "./db/index.js";
 import { app } from "./app.js";


dotenv.config({
    path:'./env'
})

connectDB().then(()=>{
   app.listen(process.env.PORT || 8000,()=>{
    console.log(`mondodb running on this port :${process.env.PORT}`)
   })
}).catch((error)=>{
    console.log("mongodb connection fail",error )
})