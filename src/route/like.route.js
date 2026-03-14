import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware";
import { togglelike } from "../controller/like.controller";

const router=Router()

router.route("/video/:videoId").post(jwtverify,togglelike)

export default router

