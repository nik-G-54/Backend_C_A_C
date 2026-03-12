import {Router} from "express";
import { Upload } from "../middleware/multer.js";
import {uploadVideo,getALLvideo} from "../controller/video.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";

const router=Router();

router.route("/upload").post(jwtverify,Upload.fields([
    {name:"videoupload",maxCount:1},
    {name:"thumbnailupload",maxCount:1}
]),uploadVideo)
router.route("/getallvideos").get(getALLvideo)


export default router
    