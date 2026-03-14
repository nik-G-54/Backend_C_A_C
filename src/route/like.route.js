import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware.js";
import { togglelike } from "../controller/like.controller.js";

const router=Router()

router.route("/video/:videoId").post(jwtverify,togglelike)

export default router

