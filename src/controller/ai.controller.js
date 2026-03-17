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
import { Doubt } from "../models/dout.model.js"
import { generateNotesPDF } from "../service/pdf.service.js"
import { Video } from "../models/video.model.js"

export const askAI = asynchandler(async (req, res) => {

    const { question } = req.body

    if (!question) {
        throw new ApiError(400, "Question is required")
    }

    const answer = await generateAIResponse(question)

    const doubt = await Doubt.create({
        user: req.user?._id,
        question,
        answer
    })

    return res.status(200).json(
        new ApiResponse(
            200,
           doubt,
            "AI response generated successfully"
        )
    )
})


// history 



export const getDoubtHistory = asynchandler(async(req, res) => {
    const doubts = await Doubt.find({
        user: req.user?._id
    }).sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(
            200,
            doubts,
            "Doubt history fetched successfully"
        )
    )
})



///pdf grnerater

export const generateNotes=asynchandler(async(res,req)=>{

    const doubts=await Doubt.find({
        user: req.user?._id

    }).sort({createdAt:-1})

    if(doubts){
        throw new ApiError(404,"No doubts found")
    }

generateNotesPDF(doubts,res)

})


// 
export const VideoDoubtAI=asynchandler(async(req,res)=>{
    const {videoId,question}=req.body

    if (!videoId || !question) {
        throw new ApiError(400, "VideoId and Question are required")
    }

    const video= await Video.find(ById(videoId)) 

     if (!video) {
        throw new ApiError(404, "Video not found")
    }
    
//      const prompt = `
// Video Transcript:
// ${video.transcript}

// Student Question:
// ${question}

// Answer based only on the transcript.
// `
const prompt= `
Video Content:
${bestChunk.text}

Student Questiion:
${
    question
} 
Answer using only  the content above`

  const answer = await generateAIResponse(prompt)

    return res.status(200).json(
        new ApiResponse(200, { answer }, "Video doubt solved successfully")
    )

})