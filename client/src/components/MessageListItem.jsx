import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProfileImage from "./ProfileImage"
import TrimText from '../helpers/TrimText'
import TimeAgo from 'react-timeago'

const MessageListItem = ({ conversation }) => {
  const onlineUsers = useSelector(state => state?.user?.onlineUsers);
  
  const participant = conversation?.participants?.[0];
  const isOnline = onlineUsers?.includes(participant?._id);

  if (!participant) return null;

  return (
    <Link 
      to={`/messages/${participant._id}`}
      className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-slate-50 border border-transparent hover:border-slate-100 group"
    >
      <div className="relative flex-shrink-0">
        <ProfileImage 
          image={participant?.profileImg} 
          className="w-11 h-11 rounded-full object-cover" 
        />
        
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h5 className="text-sm font-semibold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
            {participant?.fullname || "Unknown User"}
          </h5>
          <small className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
            {conversation?.updatedAt ? (
              <TimeAgo date={conversation.updatedAt} />
            ) : (
              <TimeAgo date={conversation?.createdAt} />
            )}
          </small>
        </div>
        
        <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[90%]">
          {conversation?.lastMessage?.senderId === participant._id ? '' : 'You: '}
          <TrimText item={conversation?.lastMessage?.text || "Sent an attachment"} maxLength={28} />
        </p>
      </div>
    </Link>
  );
};

export default MessageListItem;