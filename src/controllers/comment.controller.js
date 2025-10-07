import mongoose from "mongoose";
import { Comment } from "../models/comments.models.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body || {};
  const { id } = req.params;
  if (!content) throw new ApiError(400, "content is mandatory");
  const user = await User.findById(req.user._id);
  const video = await Video.findById(id);
  await Comment.create({
    content,
    user,
    video,
  });
  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Commented on video successfully"))
});

const videoComments = asyncHandler(async (req,res) => {
     const { id } = req.params;
     if(!id)
        throw new ApiError(400, "Video Id is required");
    const comments = await Comment.aggregate([{
        $match: {
            video: new mongoose.Types.ObjectId(id)
        }
    }]);
    return res.status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
})

export { addComment, videoComments };
