import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import userRouter from "./route/user.route.js"
import videoRouter from "./route/video.route.js"
import likeRouter from "./route/like.route.js"
import commentRouter from "./route/comment.route.js"
import subscriptionRoutes from "./route/subscribe.route.js";
import chatRoutes from "./route/chat.route.js"
import aiRoutes from "./route/ai.route.js"

const app = express();

app.use(cors({
    origin: process.env.CROSS_ORI || "*",
    credentials: true
}))
app.use(helmet())

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes declared
app.set("trust proxy", true)
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/chat", chatRoutes)
app.use("/api/v1/ai", aiRoutes)

// Default Express Error Handler to prevent HTML stack traces
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
});

export { app }

