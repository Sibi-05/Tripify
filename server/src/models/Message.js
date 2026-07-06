import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId:{
        type:Schema.Types.ObjectId,
            ref:"Conversation",
            required:true
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("Message", messageSchema);

export default Comment;
