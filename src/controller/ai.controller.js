import { generateAIResponse } from "../service/ai.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asynchandler } from "../utils/asynchandler";
import {ApiError} from "../utils/ApiError.js"

const askAI= asynchandler(async(req,res)=>{
    const {question, videoId, timestamp}=req.body

    if(!question){
        throw new ApiError(400, "Question is required")
    }

    const answer=await generateAIResponse(question)

    return res.status(200).json(
        200,{answer,videoId,timestamp}, "AI answer generated successfully"
    )
})


export {askAI}