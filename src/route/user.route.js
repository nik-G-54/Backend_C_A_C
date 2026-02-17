import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware.js";
import { loginUser, userRegister,logoutUser,refreshAccessToken } from "../controller/user.controller.js";
import { Upload } from "../middleware/multer.js";


const router=Router();


router.route("/register").post(Upload.fields([  // here file accept the array 
    {
        name:"avtar",
        maxcount:1
    },
    {
        name:"coverImage",
        maxcount:1
    }
]),userRegister)
router.route("/login").post(loginUser)

// secured route 
router.route("/logout").post(jwtverify,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router