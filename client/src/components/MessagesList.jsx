import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSocket } from '../context/SocketContext'; 
import MessageListItem from './MessageListItem';

const MessagesList = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(state => state?.user?.currentUser?.token);
  
  const socket = useSocket();

  const getConversations = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/conversations`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setConversations(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch sidebar chats:", error?.response?.data || error.message);
    }
  }, [token]);

  
  useEffect(() => {
    setIsLoading(true);
    getConversations().finally(() => setIsLoading(false));
  }, [getConversations]);


  useEffect(() => {
    if (!socket) return;

    const handleRealtimeUpdate = (payload) => {
      console.log("Widget sidebar received live update event:", payload);

      getConversations();
    };

    socket.on("newMessage", handleRealtimeUpdate);
    socket.on("conversationUpdated", handleRealtimeUpdate);

    return () => {
      socket.off("newMessage", handleRealtimeUpdate);
      socket.off("conversationUpdated", handleRealtimeUpdate);
    };
  }, [socket, getConversations]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Recent Messages
        </h3>
        {socket?.connected && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" title="Live Pipeline Active"></span>
          </span>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-3 animate-pulse py-1">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                <div className="h-2 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-2">No recent chats.</p>
      ) : (
        <div className="divide-y divide-slate-50 space-y-1 max-h-80 overflow-y-auto pr-1">
          {conversations.map(conversation => (
            <div key={conversation?._id} className="pt-1 first:pt-0">
              <MessageListItem conversation={conversation} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesList;