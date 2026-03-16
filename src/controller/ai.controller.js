// import { generateAIResponse } from "../service/ai.service.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asynchandler } from "../utils/asynchandler.js";
// import {ApiError} from "../utils/ApiError.js"

// const askAI= asynchandler(async(req,res)=>{
//     const {question, videoId, timestamp}=req.body

//     if(!question){
//         throw new ApiError(400, "Question is required")
//     }

//     try {
//         const answer=await generateAIResponse(question)

//         return res.status(200).json(
//             new ApiResponse(200, {answer, videoId, timestamp}, "AI answer generated successfully")
//         )
//     } catch (error) {
//         throw new ApiError(500, error.message || "Failed to generate AI Response")
//     }
// })


// export {askAI}

import { generateAIResponse } from "../service/ai.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asynchandler } from "../utils/asynchandler.js"

export const askAI = asynchandler(async (req, res) => {

    const { question } = req.body

    if (!question) {
        throw new ApiError(400, "Question is required")
    }

    const answer = await generateAIResponse(question)

    return res.status(200).json(
        new ApiResponse(
            200,
            { question, answer },
            "AI response generated successfully"
        )
    )
})