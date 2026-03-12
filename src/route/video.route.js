import express from "express";
import { Upload } from "../middleware/multer.js";
import {uploadVideo} from "../controller/video.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";

const router=express.Router();

router.route("/upload").post(verifyToken,Upload.fields([
    {name:"videoupload",maxCount:1},
    {name:"thumbnailupload",maxCount:1}
]),uploadVideo)

export default router
    