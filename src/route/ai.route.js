import { Router } from "express";
import { askAI } from "../controller/ai.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";
import router from "./chat.route.js";

const route=Router();

router.route("/ask").post(askAI)  // here i should not add jwt because i use it for testing in the post man thats hwy but later add here 

export default router;