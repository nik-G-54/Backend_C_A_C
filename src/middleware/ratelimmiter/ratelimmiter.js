import rateLimit from "express-rate-limit";


// general api route 
export const ApiRatelimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per 15 minutes
   message: {
        success: false,
        message: "Too many requests, please try again later"
   },
   standardHeaders: true,
   legacyHeaders: false
})

// strict limiter for registration (max 5 per 15 min)
export const registerratelimt = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many registration attempts, please try again later"
    }
})

// login rate limiter
export const logginratelimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login attempts, please try again later"
    }
})