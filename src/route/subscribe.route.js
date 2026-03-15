import { Router } from "express"
import { jwtverify } from "../middleware/auth.middleware.js"
import { toggleSubscribe } from "../controller/subscription.controller.js"

const router= Router()

router.route("/:channelId")
.post(jwtverify,toggleSubscribe);

export default router;