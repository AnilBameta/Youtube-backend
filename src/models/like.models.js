import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
    video: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
    },
    likedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "comment"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Like = mongoose.model("Like", likeSchema);
