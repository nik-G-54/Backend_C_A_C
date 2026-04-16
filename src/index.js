import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"

import connectDB from "./db/index.js"
import { app } from "./app.js"
import { initialliseSocket } from "./Socket.io/socket.js"

dotenv.config({
    path: "./.env"
})

// create http server
const server = http.createServer(app)

// create socket server
const io = new Server(server, {
    cors: {
        origin: process.env.CROSS_ORI || "*",
        methods: ["GET", "POST"]
    }
})

// initialize socket events
initialliseSocket(io)

connectDB()
.then(() => {

    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port ${process.env.PORT || 8000}`)
    })

})
.catch((error) => {
    console.log("MongoDB connection failed:", error)
})