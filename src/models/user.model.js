import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema= new Schema(
    {
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"please provide a password"]
    },
    fullname:{
        type:String,
        reuired:true,
        lowercase:true,
        trim:true
    },
    avtar:{
        url:{
             type:String,
        required:true
        },
        public_id:{
             type:String,
        required:true
        }
       
    },
    coverImage:{
        url:{
              type:String
        },
        public_id:{

            type:String
        }
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return ; // this is use to check that only  password is modified or not if not then return if other feild modified like username or email then it will not return and it will save the data in the database
    this.password=await  bcrypt.hash(this.password,10)
   
})
   userSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password)
   }  


userSchema.methods.generateAccessToken=function async(){
    return  jwt.sign({
        _id:this._id,
      email: this.email,
            username: this.username,
            fullname: this.fullname
    },
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
}
)}

userSchema.methods.generateRefreshToken=function async(){
    return jwt.sign({
        _id:this._id
    },
     process.env.REFRESH_TOKEN_SECRET,
     {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
     }
)}

 export  const User= mongoose.model("User",userSchema)








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
