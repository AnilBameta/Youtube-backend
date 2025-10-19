import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { likeVideoComment, videoCommentLikesCount } from "../controllers/like.controller.js";

const router = Router();

router.route('/video-comment/:id').post(verifyJwt, likeVideoComment);
router.route('/count-video-comment/:id').get(verifyJwt, videoCommentLikesCount);

export default router;