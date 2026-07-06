import express from "express";
import { registerUser,changeProfileImg,loginUser,editUsers,getUsers,followUnfollowUser,getUser,getFollowersFollowing } from "../controllers/userController.js";
import {getUserBookMarks,getUserTrips} from "../controllers/tripController.js";
import authMiddleWare from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/bookmarks',authMiddleWare,getUserBookMarks);
router.get('/',getUsers);
router.get('/:id',getUser);
router.patch('/:id',authMiddleWare,editUsers);
router.get('/:id/follow-unfollow',authMiddleWare,followUnfollowUser);
router.post('/profile',authMiddleWare, upload.single("profileImg"),changeProfileImg);
router.get('/:id/trips',authMiddleWare,getUserTrips);

router.get("/:id/follow-list", authMiddleWare, getFollowersFollowing);

export default router;