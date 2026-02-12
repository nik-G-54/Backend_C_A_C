import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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


userScheema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await  bcrypt.hash("password",10)
     next()

   userScheema.method.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password)
   }  
})

userScheema.method.generateAccessToken=function async(){
    return  jwt.sign({
        _id:this._id,
      email: this.email,
            username: this.username,
            fullName: this.fullName
    },
process.env.ACCESS_TOKEN_SECRET),
{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
}
}

userScheema.method.generateRefreshToken=function async(){
    return jwt.sign({
        _id:this._id
    },
     process.env.REFRESH_TOKEN_SECRET),
     {
        expiresIn:REFRESH_TOKEN_EXPIRY
     }
}

 export const User= mongoose.model("User",userScheema)








/*
todos----
1- basic struture of import mongoose
2-create userScheema
3-export User jo hr file me import hoga 
4-use middleware if require like to save password in the mongoDB first it convert into hash 
5- use pre hook with the useScheema its work is to save password in mongodb in hashed formate 
6-validate the password 
7-generate Access token and refresh token 
8-refresh token should be store in the db 
*/
