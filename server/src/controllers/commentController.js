import HttpError from "../models/Error.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Trip from "../models/Trip.js";
import mongoose from "mongoose";

const getTripComments = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId).populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "creator",
        select: "fullname profileImg _id", 
      },
    });
    if (!trip) {
      return next(new HttpError("Trip not found", 404));
    }
    res.status(200).json(trip.comments);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const createComment = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return next(new HttpError("Please write the comment", 422));
    }

    let newComment = await Comment.create({
      creator: req.user.id,
      tripId,
      comment,
    });

    await Trip.findByIdAndUpdate(tripId, { $push: { comments: newComment._id } });

    // Explicitly await the execution of the population path
    newComment = await Comment.findById(newComment._id).populate("creator", "fullname profileImg");

    res.status(201).json(newComment);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteComments = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new HttpError("Comment not found", 404));
    }

    if (comment.creator.toString() !== req.user.id.toString()) {
      return next(new HttpError("UnAuthorized!", 403));
    }

  
    await Trip.findByIdAndUpdate(comment.tripId, { 
      $pull: { comments: new mongoose.Types.ObjectId(commentId) } 
    });
    
    await Comment.findByIdAndDelete(commentId);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export { createComment, getTripComments, deleteComments };