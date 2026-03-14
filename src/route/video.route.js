import {Router} from "express";
import { Upload } from "../middleware/multer.js";
import {uploadVideo,getALLvideo,getVideoById} from "../controller/video.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";

const router=Router();

router.route("/upload").post(jwtverify,Upload.fields([
    {name:"videoupload",maxCount:1},
    {name:"thumbnailupload",maxCount:1}
]),uploadVideo)
router.route("/getallvideos").get(getALLvideo)
router.route("/:videoId").get(getVideoById)


export default router
    








//finally API endPoints 
//1-POST /api/v1/videos/upload
//2-Get Video Feed -==