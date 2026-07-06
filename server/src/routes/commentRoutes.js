import express from "express";
import { createComment, deleteComments, getTripComments } from "../controllers/commentController.js";
import authMiddleWare from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/:tripId',authMiddleWare,createComment);
router.get('/:tripId',getTripComments);
router.delete('/:commentId',authMiddleWare,deleteComments);

export default router;