import React from 'react'
import { useSelector } from 'react-redux'

const MessageItem = ({ message }) => {
  const userId = useSelector(state => state?.user?.currentUser?.id);
  const isMe = message?.senderId === userId;

  return (
    <li className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 ${
          isMe 
            ? 'bg-slate-900 text-white rounded-tr-none' 
            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
        }`}
      >
        <p className="break-words whitespace-pre-wrap">{message?.text}</p>
      </div>
    </li>
  );
};

export default MessageItem;