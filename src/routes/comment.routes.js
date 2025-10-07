import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComment, videoComments } from "../controllers/comment.controller.js";

const router = Router();

router.route("/add-comment/:id").post(verifyJwt, addComment);
router.route("/video-comments/:id").get(verifyJwt, videoComments)

export default router;