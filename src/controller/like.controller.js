import { Like } from "../models/like.model";
import { ApiError} from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asynchandler } from "../utils/asynchandler";



const togglelike=asynchandler(async(req,res)=>{


    const {VideoId}=req.params
    const userId=req.user._id

    // usser already likes the video 
    const existLike= await Like.findOne(
       {
        video:VideoId,
        likedBy:userId
       }
    )

    if(existLike){
     //removelike
       await Like.deleteOne({
          _id:existLike._id
      })

      return res.stauts(200),json(
        new ApiResponse(200,null,"VideoUnliked")
      )
    }
    else{
        // add like 
        await Like.create({
            video:VideoId,
            LikedBy:userId
        })

        return res.stauts(200).json(
            new ApiResponse(200,null,"VideoLIked")
        )
    }

})

export {
    togglelike
}   