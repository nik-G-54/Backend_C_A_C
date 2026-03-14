
// import dotenv from "dotenv"
// import mongoose from "mongoose";
// import connectDB from "./db/index.js";
// import { app } from "./app.js";
// import { initialliseSocket } from "./Socket.io/socket.js";


// dotenv.config({
//     path: './.env'
// })

// const server = http.createServer(app)



// connectDB().then(() => {
//     app.listen(process.env.PORT, () => {
//         console.log(`mondodb running on this port :${process.env.PORT}`)
//     })
// }).catch((error) => {
//     console.log("mongodb connection fail", error)
// })

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
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// initialize socket events
initialliseSocket(io)

connectDB()
.then(() => {

    server.listen(process.env.PORT || 8000, () => {

        console.log(`MongoDB connected`)
        console.log(`Server running on port ${process.env.PORT}`)

    })

})
.catch((error) => {

    console.log("MongoDB connection failed:", error)

})