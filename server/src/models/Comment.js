import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;