import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

// add comment 
const addcomment=asynchandler(async(req,res)=>{
    const {videoId}=req.params
    const {content}=req.body


    if(!content){
       throw new ApiError(400,"Comment content required")
    }

    const comment= await Comment.create({
        content,
        video:videoId,
        owner:req.user._id
    })

    return res.status(200).json(
        new ApiResponse(200,comment,"Comment added successfully ")
    )
}) 

// Get comment 

const gertVideoComment= asynchandler(async(req,res)=>{

    const {videoId}=req.params

    const comment = await Comment.find({
        video:videoId
    }).populate("owner","username avtar")
    .sort({createdAt:-1})

 return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comments fetched successfully"
        )
    )

}) 

// Delet comment 

const deleteComment=asynchandler(async(req,res)=>{

    const {commentId}= req.params

      const comment =await Comment.findById(commentId)
       
         if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You can delete only your comment")
    }

    await comment.deleteOne()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    )
})

export {
  addcomment  ,
  deleteComment,
  gertVideoComment
}