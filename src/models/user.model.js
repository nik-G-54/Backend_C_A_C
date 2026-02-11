import mongoose from "mongoose";

const userScheema= new mongoose.Schema({
    username:{
        type:String,
        require:true,
        Unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:true,
        require:true,
        lowercase:true,
        trim:true,
        Unique:true
    },
    password:{
        type:String,
        require:[true,"please provide a password"]
    },
    fullname:{
        type:String,
        reuire:true,
        lowercase:true,
        trim:true
    },
    avtar:{
        type:String,
        require:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[{
        type:Scheema.Type.ObjectId,
        ref:"Video"
    }],
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
})


 export const User= mongoose.model("User",userScheema)