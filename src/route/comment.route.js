import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware";
 import {
addComment,
getVideoComments,
deleteComment
} from "../controllers/comment.controller.js";

const router=Router();
  router.route("/:videoId").post(jwtverify,addComment).get(getVideoComments)

  router.route("/delete/:commentId").delete(jwtverify,deleteComment)

  export default router;