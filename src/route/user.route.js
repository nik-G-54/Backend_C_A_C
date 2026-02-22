import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware.js";
import { loginUser, userRegister,logoutUser,refreshAccessToken,
    changePassword,
    getCurrentUser
 } from "../controller/user.controller.js";
import { Upload } from "../middleware/multer.js";
import { logginratelimit ,registerratelimt } from "../middleware/ratelimmiter/ratelimmiter.js";
// import ratelimit from "express-rate-limit"

const router=Router();


router.route("/register").post(registerratelimt,Upload.fields([  // here file accept the array 
    {
        name:"avtar",
        maxcount:1
    },
    {
        name:"coverImage",
        maxcount:1
    }
]),userRegister)
router.route("/login").post(logginratelimit,loginUser)

// secured route 
// router.route("/logout").post(jwtverify,logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(changePassword)
// router.route("/getCurrentUser").post(getCurrentUser)

// secure route 
router.route("/logout").post(jwtverify,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(changePassword)
router.route("/getCurrentUser").post(getCurrentUser)


export default router