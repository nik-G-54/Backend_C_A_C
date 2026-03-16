import mongoose from "mongoose";

const doubtSchema= new mongoose.Schema({
    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    reqquired:true
    },
    question:{
        type:String,
        require:true
    }, answer:{
        type:String,
        required:true
    },

    topic:{
        type:String,
        default:"general"
    }
},
{
    timestamps:true
})

export const Doubt = mongoose.model("Doubt",doubtSchema)
