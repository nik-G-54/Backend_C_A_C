import mongoose from "mongoose";

const likescheema= new mongoose.Schema(
    {
        video:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video",
            required:true
        },
        likes:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {timestamps:true}
)

export const Like=mongoose.model("Like",likescheema)