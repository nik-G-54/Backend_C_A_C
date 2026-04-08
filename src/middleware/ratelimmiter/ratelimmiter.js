import rateLimit from "express-rate-limit";


// general api route 
export const ApiRatelimiter= rateLimit({
    windowMs:15*60*1000,
    max:100, // 100 request per min
   message:{
success:false,
message:"to many request please try again"
   },
   standardHeaders:true,
   legacyHeaders:false
})  

// strict limmiter for registration 

export const registerratelimt=rateLimit({
    windowMs:15 * 60 * 1000,
    max:50,
    message:{
        success:false ,
        message:"to many request"
    }
}) 

/// login ratelimmiter
export const logginratelimit= rateLimit({
    windowMs:5*60*1000,
    max:10,
    message:{
        status:false,
        message:"to many request"
    }
})