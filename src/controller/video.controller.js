import {Video} from "../models/video.model.js"
import {asynchandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {deletefilefromCloudinary} from "../utils/deletefilefromCloudinary.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"



const uploadVideo = asynchandler(async (req, res) => {

    const {title,description}=req.body;
    
    if(!title || !description){
        throw new ApiError(400,"title and description are required")
    }
 
    const videofileLocalpath=req.files?.video?.[0]?.path;
    const thumbnailLocalpath=req.files?.thumbnail?.[0]?.path;

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
const getALLvideo=asynchandler(async(req,res)=>{
      const {page=1,limit=10}=req.query;
      const skip=(page-1)*limit;
      const videos=await Video.find({isPublished:true})
        .populate("owner","username avtar")
        .skip(skip)
        .sort({createdAt:-1})
        .limit(limit);

        return res.status(200).json(
            new ApiResponse(200,"Video  fetch successfully",videos)
        )

    });
    console.log("all videos:",getALLvideo)

    // get videoby id 





    const getVideoById = asynchandler (async(req,res)=>{

        const {videoId}=req.params;
         
        const video=await Video.findByIdAndUpdate(
videoId,
{$inc:{views:1}},
{new:true}
).populate("owner","username avtar")

console.log("fetchvideo:",video)
if(!video){
    throw new ApiError(404,"Video not found ")
}
const subscriberCount=await Subscription.countDocuments({
     channel:video.owner._id
})
console.log(subscriberCount)

const likeCount = await Like.countDocuments({
 video:videoId
})
console("totalLikes:",likeCount)

return res.status(200).json(
    new ApiResponse(
        200,
        {
            video,
            subscriberCount,
            likeCount
        },
        "video fetch successfully "
    )
)

        
    })

export {uploadVideo,
getALLvideo,
getVideoById
}