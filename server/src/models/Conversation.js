import mongoose, { Schema } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lastMessage:{
        text:{
            type:String,
            required:true
        },
        senderId: {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("Conversation", conversationSchema);

export default Comment;
