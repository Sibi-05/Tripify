import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  createTrip,
  getTrip,
  getTrips,
  updateTrip,
  deleteTrip,
  getFollowingTrips,
  likeTrips,
  createBookMark,
} from "../controllers/tripController.js";
import authMiddleWare from "../middleware/auth.middleware.js";

const router = express.Router();

// Create
router.post(
  "/",
  authMiddleWare,
  upload.array("media", 10),
  createTrip
);


router.get("/", authMiddleWare, getTrips);
router.get("/following", authMiddleWare, getFollowingTrips);


router.get("/:id/like", authMiddleWare, likeTrips);
router.post("/:id/bookmark", authMiddleWare, createBookMark);

router.get("/:id", authMiddleWare, getTrip);
router.patch("/:id", authMiddleWare, updateTrip);
router.delete("/:id", authMiddleWare, deleteTrip);

export default router;