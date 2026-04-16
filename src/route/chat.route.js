import { Router } from "express"
import { getChatMessages } from "../controller/chat.controller.js"
import { jwtverify } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/:videoId").get(jwtverify, getChatMessages)

export default router