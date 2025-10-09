import { Comment } from "../models/comments.models.js";
import { Like } from "../models/like.models.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const likeVideoComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body || {};
  const user = await User.findById(req.user?._id);
  if (!id) throw new ApiError("Id is required");
  if (!type) throw new ApiError("Type is required");
  if (type === "video") {
    let videoValue = await Video.findById(id);
    if (!videoValue) throw new ApiError(401, "Video id is incorrect");
    await Like.create({
      video: videoValue,
      likedBy: user?._id,
      type,
    });
  } else {
    let commentValue = await Comment.findById(id);
    if (!commentValue) throw new ApiError(401, "Comment id is incorrect");
    await Like.create({
      comment: commentValue,
      likedBy: user?._id,
      type,
    });
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video comment liked successfully"));
});

export { likeVideoComment };
