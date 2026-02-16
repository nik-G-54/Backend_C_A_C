import { Router } from "express";

import { loginUser, userRegister } from "../controller/user.controller.js";
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

export default router