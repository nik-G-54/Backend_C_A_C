import { Router } from "express";

import { userRegister } from "../controller/user.controller.js";
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

export default router