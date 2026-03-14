import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Subscription } from "../models/subscription.model";
import { asynchandler } from "../utils/asynchandler";



const toggleSubscribe=asynchandler(async(req,res)=>{

    const {channelId}= req.params
    const userId=req.user.userId

     if (!channelId) {
        throw new ApiError(400, "Channel id required")
    }

    const isSubscribed=await Subscription.findOne({
        subscriber:userId,
        channel:channelId
 })
if(isSubscribed){
            await Subscription.deleteOne({
                _id:isSubscribed._id
            })

             return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Unsubscribed successfully"
            )
        )
}
// if not subscribe

const newSubscriber=await Subscription.create({
      subscriber: userId,
        channel: channelId
})



    return res.status(200).json(
        new ApiResponse(
            200,
            newSubscription,
            "Subscribed successfully"
        )
    )

})

export {toggleSubscribe}
