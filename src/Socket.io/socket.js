export const initialliseSocket=(io)=>{
    io.on("connection",(socket)=>{
        console.log("user-connected",socket.id)


        // join video room 
        socket.on("join-video-room",(videoId)=>{
            socket.join(videoId)
        })

        //recive message

        io.to(videoId).emmit("recived-message",{
            user,
            message
        })

           socket.on("disconnect", () => {
            console.log("User disconnected")
        })

    }) 
}