import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandller.js";
import jwt from "jsonwebtoken"


export const jwtverify=asynchandler(async(req,res)=>{
    try {
 
        const token=  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("token",token)

        if(!token) {
            throw new ApiError(401,"invalid token  \\ unautherised user ")
        }

        const decodeToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log(decodeToken)
        const user=await User.findById(decodeToken?._id).select("-password -refreshToken")
        console.log(user)

        if(!user){
            throw new ApiError(401,"unautherised user invalid token")
        }
        req.user=user ;
       
        
    } catch (error) {
        throw new ApiError(401,error?.message ,"invalid user")
    }
})


// here we verify the token so 
//1- extract token from the cookes 