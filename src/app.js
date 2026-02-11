import express from "express";
import cors from "cors";

import userRouter from "./route/user.route.js" 


const app=express();

app.use("/api/v1/user",userRouter);


export {app}

