import mongoose from "mongoose";


const commentSchema=new mongoose.Schema({

    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        require:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    content:{
        type:String,
        require:true,
        trim:true
    }
},
{
    timestamps:true
});

export const  Comment= mongoose.model("Comment",commentSchema);