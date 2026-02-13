import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";




const app=express();
app.use(cors({
    origin:process.env.CROSS_ORI,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))// we are accepting data in the json formate with th ehelp of express
// this app.use(express.urldecoder()) is used to extract data from url with the help of express
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// if static file like logo and other things are comming that are store in any folder like public
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
 import userRouter from "./route/user.route.js"  



// routes declared
app.use("/api/v1/users",userRouter);


export {app}

