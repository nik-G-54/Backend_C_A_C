import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
{
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    message:{
        type:String,
        required:true
    }
},
{timestamps:true}
)

export const ChatMessage = mongoose.model("ChatMessage",chatMessageSchema)