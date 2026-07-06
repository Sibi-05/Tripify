import User from "../models/User.js";
import HttpError from "../models/Error.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

const registerUser = async (req, res, next) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;
    if (!fullname || !email || !password || !confirmPassword) {
      return next(new HttpError("Fill in all feilds", 422));
    }
    const lEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: lEmail });
    if (emailExists) {
      return next(new HttpError("Email Already Exists!", 422));
    }
    if (!validator.isEmail(lEmail)) {
      return next(new HttpError("Please enter a valid email address", 422));
    }
    if (password.length < 6) {
      return next(new HttpError("Password must be at least 6 characters", 422));
    }
    if (password !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email: lEmail,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in all fields", 422));
    }
    const lEmail = email.toLowerCase();

    const user = await User.findOne({ email: lEmail });

    if (!user) {
      return next(new HttpError("Not Found!", 422));
    }
    const { uPassword, ...userInfo } = user;

    const comparedPass = await bcrypt.compare(password, user?.password);

    if (!comparedPass) {
      return next(new HttpError("Email or Password Incorrect!", 422));
    }
    const token = await jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    res.status(200).json({ token, id: user?._id,profileImg: user?.profileImg, ...userInfo });
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(new HttpError(error));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().limit(10).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(new HttpError(error));
  }
};

const editUsers = async (req, res, next) => {
  try {
    const { fullname, bio, location } = req.body;
    const editedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullname, bio, location },
      { new: true },
    );
    res.status(200).json(editedUser);
  } catch (error) {
    next(new HttpError(error));
  }
};

const followUnfollowUser = async (req, res, next) => {
  try {
    const userToFollowId = req.params.id;
    const currentUserId = req.user.id;
    
    if (currentUserId === userToFollowId) {
      return next(new HttpError("You Can't Follow Yourself!", 422));
    }
    
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return next(new HttpError("User not found!", 404));
    }
    
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return next(new HttpError("Current user not found!", 404));
    }

    const isFollowing = currentUser.following?.includes(userToFollowId);
    
    let updatedUser;
    
    if (!isFollowing) {
      updatedUser = await User.findByIdAndUpdate(
        userToFollowId,
        { $push: { followers: currentUserId } },
        { new: true }
      );
      
      await User.findByIdAndUpdate(
        currentUserId,
        { $push: { following: userToFollowId } },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userToFollowId,
        { $pull: { followers: currentUserId } },
        { new: true }
      );
      
      await User.findByIdAndUpdate(
        currentUserId,
        { $pull: { following: userToFollowId } },
        { new: true }
      );
    }
    
    return res.status(200).json({
      success: true,
      message: !isFollowing ? "User followed successfully!" : "User unfollowed successfully!",
      user: updatedUser,
      isFollowing: !isFollowing
    });
    
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const changeProfileImg = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new HttpError("Please upload an image", 422));
    }

    const file = req.file;

    const fileName = `profile/${uuidv4()}-${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profileImg: imageUrl,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};
const getFollowersFollowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const user = await User.findById(id)
      .populate("followers", "fullname username profileImg")
      .populate("following", "fullname username profileImg");

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (type === "followers") {
      return res.status(200).json({
        success: true,
        count: user.followers.length,
        users: user.followers,
      });
    }

    if (type === "following") {
      return res.status(200).json({
        success: true,
        count: user.following.length,
        users: user.following,
      });
    }

    return next(
      new HttpError("Query parameter 'type' must be 'followers' or 'following'", 400)
    );
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};
export {
  registerUser,
  loginUser,
  changeProfileImg,
  followUnfollowUser,
  editUsers,
  getUsers,
  getUser,
  getFollowersFollowing
};
