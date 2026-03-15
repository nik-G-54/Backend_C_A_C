import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware.js";
 import {
addComment,
getVideoComments,
deleteComment
} from "../controller/comment.controller.js";

const router=Router();
  router.route("/:videoId").post(jwtverify,addComment).get(getVideoComments)

  router.route("/delete/:commentId").delete(jwtverify,deleteComment)

  export default router;