import { Router } from "express";
import { askAI, getDoubtHistory } from "../controller/ai.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/ask").post(askAI)  // here i should not add jwt because i use it for testing in the post man thats hwy but later add here 
router.route("/history").get(getDoubtHistory)
export default router;