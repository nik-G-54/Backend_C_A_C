import {Video} from "../models/video.model.js"
import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {deletefilefromCloudinary} from "../utils/asynchandler.js"
import { User } from "../models/user.model.js"



const uploadVideo = asynchandler(async (req, res) => {

    const {title,description}=req.body;
    
    if(!title || !description){
        throw new ApiError(400,"title and description are required")
    }
 
    const videofileLocalpath=req.file?.video?.[0]?.path;
    const thumbnailLocalpath=req.file?.thumbnail?.[0]?.path;

    if(!videofileLocalpath || !thumbnailLocalpath){
        throw new ApiError(400,"video and thumbnail are required")
    }

    const videoupload=await uploadOnCloudinary(videofileLocalpath)
    const thumbnailupload=await uploadOnCloudinary(thumbnailLocalpath)

    if(!videoupload || !thumbnailupload){
        throw new ApiError(500,"video and thumbnail upload failed")
    }

    const video=await Video.create({
        title,
        description,
        videoFile:{
        url:videoupload.secure_url,
        public_id:videoupload.public_id
        },
        thumbnail:{
            url:thumbnailupload.secure_url,
            public_id:thumbnailupload.public_id
        },
        owner:req.user?._id,
        views:0,
        isPublished:true // this is by default true  to confirm 
 })

 return res.status(201).json(
    new ApiResponse(201,"video uploaded successfully",video)
 );    
});


// get all videos 


export {uploadVideo,

}