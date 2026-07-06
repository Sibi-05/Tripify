import HttpError from "../models/Error.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Comment from "../models/Comment.js";
import s3 from "../config/s3.js";

import { v4 as uuidv4 } from "uuid";

const createTrip = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startLocation,
      destination,
      startDate,
      endDate,
      tags,
    } = req.body;

    if (
      !title ||
      !description ||
      !startLocation ||
      !destination ||
      !startDate ||
      !endDate
    ) {
      return next(new HttpError("Please fill in all required fields.", 422));
    }

    if (!req.files || req.files.length === 0) {
      return next(new HttpError("Please upload at least one image or video.", 422));
    }

    const media = [];

    for (const file of req.files) {
      if (file.size > 10 * 1024 * 1024) {
        return next(
          new HttpError(`${file.originalname} exceeds the 10MB limit.`, 422)
        );
      }

      const fileName = `trips/${uuidv4()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      media.push({
        url: fileUrl,
        mediaType: file.mimetype.startsWith("image/")
          ? "image"
          : "video",
      });
    }

    const newTrip = await Trip.create({
      creator: req.user.id,
      title,
      description,
      startLocation,
      destination,
      startDate,
      endDate,
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      media,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        trips: newTrip._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Trip created successfully.",
      trip: newTrip,
    });
  } catch (error) {
    next(new HttpError(error.message || "Something went wrong.", 500));
  }
};

const getTrip = async(req,res,next)=>{
    try {
    const {id}=req.params;
    const trip = await Trip.findById(id).populate("creator").populate({path:"comments",options:{sort:{createdAt :-1}}})
    res.status(200).json(trip);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
    
}

const getTrips = async(req,res,next)=>{
    try {
    const trips = await Trip.find().sort({createdAt :-1})
    res.status(200).json(trips);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const updateTrip = async(req,res,next)=>{

    try {
        const tripId = req.params.id;
        console.log(req.body)
    const body=req.body;
    const trip = await Trip.findById(tripId);

    if(trip?.creator != req.user.id){
        return next(HttpError("You can't update this Trip",403));
    }


    const updatedTrip = await Trip.findByIdAndUpdate(tripId,req.body,{new:true});
    res.status(200).json(updatedTrip);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
    
}
const deleteTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return next(new HttpError("Trip not found", 404));
    }

    if (trip.creator.toString() !== req.user.id) {
      return next(new HttpError("You can't delete this trip", 403));
    }

    await Comment.deleteMany({ tripId });

    await User.findByIdAndUpdate(trip.creator, {
      $pull: { trips: trip._id },
    });

    await Trip.findByIdAndDelete(tripId);

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};
const getFollowingTrips = async(req,res,next)=>{
    try {
        const user =await User.findById(req.user.id);
        const trips =await user.find({creator:{$in:user?.following}});
        res.status(200).json(trips)
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const likeTrips = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const currentUserId = req.user.id;

        const trip =await Trip.findById(id);

        const postAuthorId = trip.creator.toString();
        const isLiked = trip.likes.includes(currentUserId);
        if (postAuthorId !== currentUserId) {
            const authorSocketId = getReceiverSocketId(postAuthorId);
            if (authorSocketId) {
                io.to(authorSocketId).emit("tripLiked", {
                    tripId: trip._id,
                    likesCount: trip.likes.length,
                    likedBy: currentUserId,
                    isLikedNow: !isLiked
                });
            }
        }

        let updateTrip;
        if(trip?.likes.includes(req.user.id)){
            updateTrip = await Trip.findByIdAndUpdate(id,{$pull:{likes:req.user.id}},{new:true})
        }
        else{
            updateTrip = await Trip.findByIdAndUpdate(id,{$push:{likes:req.user.id}},{new:true})
        }

        io.emit("globalTripUpdate", {
            tripId: trip._id,
            likesCount: trip.likes.length
        });

        res.json(updateTrip);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
    
}
const getUserTrips = async(req,res,next)=>{
    try {
        const userId = req.params.id;
        const trips = await User.findById(userId).populate({path:"trips",options:{sort:{createdAt:-1}}});
        res.json(trips);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const createBookMark = async(req,res,next)=>{
    try {
        const {id} =req.params;
        const user = await User.findById(req.user.id);
        const tripIsBookMarked = user?.bookmarks?.includes(id);
        if(tripIsBookMarked){
            const userBookMarks = await User.findByIdAndUpdate(req.user.id,{$pull:{bookmarks:id}},{ returnDocument: "after" })
            res.json(userBookMarks)
        }
        else{
            const userBookMarks = await User.findByIdAndUpdate(req.user.id,{$push:{bookmarks:id}},{ returnDocument: "after" })
            res.json(userBookMarks)
        }
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const getUserBookMarks = async(req,res,next)=>{
    try {
        const userBookMarks =await User.findById(req.user.id).populate({path:"bookmarks",options:{sort:{createdAt:-1}}});
        res.status(200).json(userBookMarks.bookmarks);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

export{
    createTrip,getTrip,getTrips,updateTrip,deleteTrip,getFollowingTrips,likeTrips,getUserTrips,createBookMark,getUserBookMarks
}