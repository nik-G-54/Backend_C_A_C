import { Router } from "express";
import { askAI } from "../controller/ai.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";
import router from "./chat.route.js";

const route=Router();

router.route("/ask").post(jwtverify,askAI)

export default router;