// import { ChatMessage } from "../models/chatMessage.model.js"
import { ChatMessage } from "../models/chatmessage.model.js"
import { asynchandler } from "../utils/asynchandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

export const getChatMessages = asynchandler(async (req,res)=>{

    const { videoId } = req.params

    const messages = await ChatMessage.find({
        video: videoId
    })
    .populate("user","username avatar")
    .sort({createdAt:1})

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Chat messages fetched successfully"
        )
    )

})