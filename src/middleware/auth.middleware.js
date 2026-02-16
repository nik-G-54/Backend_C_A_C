import { User } from "../models/user.model";
import { ApiError } from "../utils/apierror";
import { asynchandler } from "../utils/asynchandller";


export const jwtverify=asynchandler(async(req,res,next)=>{
    try {
 
        const token=  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            throw new ApiError(401,"invalid token  \\ unautherised user ")
        }

        const decodeToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodeToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401,"unautherised user invalid token")
        }
        req.user=user ;
        next()
        
    } catch (error) {
        throw new ApiError(401,error?.message ,"invalid user")
    }
})


// here we verify the token so 
//1- extract token from the cookes 