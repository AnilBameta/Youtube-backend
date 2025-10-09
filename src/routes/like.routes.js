import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { likeVideoComment } from "../controllers/like.controller.js";

const router = Router();

router.route('/video-comment/:id').post(verifyJwt, likeVideoComment);

export default router;