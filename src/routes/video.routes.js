import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addVideo, deleteVideo, getVideoList, updateVideoDetails, updateViews } from "../controllers/video.controller.js";

const router = Router();

router.route("/update-video-views/:id").put(updateViews);

//protected routes
router.route("/add-video").post(verifyJwt,  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]), addVideo);

router.route("/video-list").get(verifyJwt,getVideoList);

router.route("/delete-video").delete(verifyJwt,deleteVideo);

router.route("/update-video-details/:id").patch(verifyJwt,updateVideoDetails);




  export default router;