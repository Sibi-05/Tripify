import HttpError from "../models/Error.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const createMessage = async(req, res, next) => {
    try {
        const { reciverId } = req.params;
        const { messageBody } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, reciverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user.id, reciverId],
                lastMessage: { text: messageBody, senderId: req.user.id }
            });
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            senderId: req.user.id,
            text: messageBody
        });

        await conversation.updateOne({
            lastMessage: { text: messageBody, senderId: req.user.id }
        });

        const receiverSocketId = getReceiverSocketId(reciverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json(newMessage);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getMessages = async(req, res, next) => {
    try {
        const { reciverId } = req.params;
        const conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, reciverId] }
        });

        if (!conversation) {
            return res.json([]);
        }
        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getConversations = async(req, res, next) => {
    try {
        let conversations = await Conversation.find({ participants: req.user.id })
            .populate({ path: "participants", select: "fullname profileImg" })
            .sort({ updatedAt: -1 });

        const formattedConversations = conversations.map((conversation) => {
            const convObj = conversation.toObject();
            convObj.participants = convObj.participants.filter(
                (p) => p._id.toString() !== req.user.id.toString()
            );
            return convObj;
        });

        res.status(200).json(formattedConversations);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

export { getConversations, getMessages, createMessage };