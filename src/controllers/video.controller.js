import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";

const addVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const user = await User.findOne(req._id).select("-password -refreshToken");

  if (!title || !description) throw new ApiError(400, "field cannot be empty");

  const videoLocalPath = req.files?.videoFile?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "video file not found");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail file not found");
  }

  const videoUrl = await uploadOnCloudinary(videoLocalPath);
  const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoUrl || !thumbnailUrl)
    throw new ApiError(
      400,
      "Something went wrong while uploading file in cloudinary"
    );

  const video = await Video.create({
    videoFile: videoUrl.url,
    thumbnail: thumbnailUrl.url,
    title,
    description,
    duration: videoUrl?.duration,
    owner: user,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully"));
});

const getVideoList = asyncHandler(async (req, res) => {
  const videoList = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, videoList, "Video list fetched successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) throw new ApiError(404, "Video Id is required");
  const video = await Video.findById(id);
  if (!video) throw new ApiError(400, "Please enter valid video Id");
  if (!video.owner.equals(req.user?._id))
    throw new ApiError(403, "You are not allowed to delete the video");
  await video.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body || {};
  if (!title && !description)
    throw new ApiError(400, "Enter title or description details");
  if (!id) throw new ApiError(404, "Video Id is required");
  const videoDetails = await Video.findById(id);
  if (!videoDetails) throw new ApiError(400, "Please enter valid video Id");
  if (!videoDetails.owner.equals(req.user?._id))
    throw new ApiError(403, "You are not allowed to delete the video");
  if (title) videoDetails.title = title;
  if (description) videoDetails.description = description;
  await videoDetails.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, videoDetails, "Video details updated successfully")
    );
});

const updateViews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(404, "Video Id is required");
  const videoDetails = await Video.findById(id);
  if (!videoDetails) throw new ApiError(400, "Please enter valid video Id");
  videoDetails.views = videoDetails.views + 1;
  await videoDetails.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, videoDetails, "Video views updated successfully")
    );
});

export { addVideo, getVideoList, deleteVideo, updateVideoDetails, updateViews };
