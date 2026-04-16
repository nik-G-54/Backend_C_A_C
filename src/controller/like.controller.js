import { Like } from "../models/like.model.js";
// import { ApiError} from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";



const togglelike=asynchandler(async(req,res)=>{


    const {VideoId}=req.params
    const userId=req.user._id

    // user already liked the video
    const existLike= await Like.findOne(
       {
        video:VideoId,
        likedBy:userId
       }
    )

    if(existLike){
     //remove like
       await Like.deleteOne({
          _id:existLike._id
      })

      return res.status(200).json(
        new ApiResponse(200,null,"VideoUnliked")
      )
    }
    else{
        // add like
        await Like.create({
            video:VideoId,
            likedBy:userId
        })

        return res.status(200).json(
            new ApiResponse(200,null,"VideoLIked")
        )
    }

})

export {
    togglelike
}   