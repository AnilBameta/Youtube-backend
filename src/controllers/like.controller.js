import mongoose from "mongoose";
import { Comment } from "../models/comments.models.js";
import { Like } from "../models/like.models.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const likeVideoComment = asyncHandler(async (req, res) => {
  let existingLike;
  const { id } = req.params;
  const { type } = req.body || {};
  const user = await User.findById(req.user?._id);
  if (!id) throw new ApiError("Id is required");
  if (!type) throw new ApiError("Type is required");
  if (type === "video") {
    let videoValue = await Video.findById(id);
    if (!videoValue) throw new ApiError(401, "Video id is incorrect");
    existingLike = await Like.findOne({
      likedBy: req.user._id,
      video: videoValue._id,
    });
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike?._id);
    } else {
      await Like.create({
        video: videoValue?._id,
        likedBy: user?._id,
        type,
      });
    }
  } else {
    let commentValue = await Comment.findById(id);
    if (!commentValue) throw new ApiError(401, "Comment id is incorrect");
    existingLike = await Like.findOne({
      likedBy: req.user._id,
      comment: commentValue?._id,
    });
    console.log(existingLike, "findByIdAndDelete");
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike?._id);
    } else {
      await Like.create({
        comment: commentValue?._id,
        likedBy: user?._id,
        type,
      });
    }
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        existingLike
          ? "Video comment unliked successfully"
          : "Video comment liked successfully"
      )
    );
});

const videoCommentLikesCount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  if (!id) throw new ApiError("Id is required");
  if (!type) throw new ApiError("Type is required");
  let likesValues;
  if (type === "video") {
    likesValues = await Like.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(id),
        },
      },
    ]);
  } else {
    likesValues = await Like.aggregate([
      {
        $match: {
          comment: new mongoose.Types.ObjectId(id),
        },
      },
    ]);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, likesValues, "Likes count sent successfully"));
});

export { likeVideoComment, videoCommentLikesCount };
