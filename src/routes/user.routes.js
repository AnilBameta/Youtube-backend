import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

//register route
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

//login route
router.route("/login").post(loginUser);

//Secure Routes

//logout route
router.route("/logout").post(verifyJwt, logoutUser);

//refresh Token route
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJwt, changePassword);

router.route("/current-user").get(verifyJwt, getCurrentUser);

router.route("/update-account-details").patch(verifyJwt, updateAccountDetails);

router
  .route("/update-avatar-image")
  .put(verifyJwt, upload.single("avatar"), updateAvatar);

router
  .route("/update-cover-image")
  .put(verifyJwt, upload.single("coverImage"), updateUserCoverImage);

router.route("/user-channels").get(verifyJwt, getUserChannelProfile);

router.route("user-watch-history").get(verifyJwt, getWatchHistory);

export default router;
