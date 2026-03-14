import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";


// ratelimmiter 
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// const app=helmet();
const app=express();
app.use(cors({
    origin:process.env.CROSS_ORI,
    credentials:true
    // this is use to secure the header of the api and it is use to prevent the attack on the api like xss attack and other attack
}))
app.use(helmet())


app.use(express.json({limit:"16kb"}))// we are accepting data in the json formate with th ehelp of express
// this app.use(express.urldecoder()) is used to extract data from url with the help of express
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// if static file like logo and other things are comming that are store in any folder like public
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
 import userRouter from "./route/user.route.js"  
 import videoRouter from "./route/video.route.js"
import likeRouter from "./route/like.route.js"
import commentRouter from "./route/comment.route.js"
import subscriptionRoutes from "./routes/subscription.routes.js";

// routes declared
app.set("trust proxy",true) // this is use to prevent the to many request on same route in this it divide the proxy 
app.use("/api/v1/users",userRouter);
app.use("/api/v1/video",videoRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/commnets",commentRouter);
app.use("/api/v1/subscriptions", subscriptionRoutes);


export {app}





