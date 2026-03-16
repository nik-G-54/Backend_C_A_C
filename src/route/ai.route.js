import { Router } from "express";
import { askAI, getDoubtHistory,generateNotes,VideoDoubtAI } from "../controller/ai.controller.js";
import { jwtverify } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/ask").post(jwtverify,askAI)  // here i should not add jwt because i use it for testing in the post man thats hwy but later add here 
router.route("/history").get(jwtverify,getDoubtHistory)
router.route("/notes-pdf").get(jwtverify,generateNotes)
router.route("/video-doubt").post(jwtverify,VideoDoubtAI)
export default router;