export const initialliseSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("user-connected", socket.id)

        // join video room
        socket.on("join-video-room", (videoId) => {
            socket.join(videoId)
        })

        // receive and broadcast message to room
        socket.on("send-message", ({ videoId, user, message }) => {
            socket.to(videoId).emit("recived-message", {
                user,
                message
            })
        })

        socket.on("disconnect", () => {
            console.log("User disconnected")
        })

    })
}