import express from "express";
import authMiddleWare from "../middleware/auth.middleware.js";
import { createMessage, getConversations, getMessages } from "../controllers/messageController.js";

const router = express.Router();
router.get("/conversations",authMiddleWare,getConversations);
router.get("/:reciverId",authMiddleWare,getMessages);
router.post("/:reciverId",authMiddleWare,createMessage);


export default router;