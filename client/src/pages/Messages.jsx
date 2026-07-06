import React, { useEffect, useRef, useState } from 'react';
import ProfileImage from '../components/ProfileImage';
import { IoMdSend } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MessageItem from '../components/MessageItem';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext.jsx'; 

const Messages = () => {
  const { receiverId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [otherMessager, setOtherMessager] = useState({});
  const [messageBody, setMessageBody] = useState("");
  const messageEndRef = useRef();

  const token = useSelector(state => state?.user?.currentUser?.token);
  
  const socket = useSocket(); 

  const getOtherMessager = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${receiverId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setOtherMessager(response?.data);
    } catch (err) {
      console.error("Failed to load participant headers:", err);
    }
  };

  const getMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${receiverId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response?.data || []);
    } catch (error) {
      console.error("Failed to render historical messages:", error);
    }
  };

  useEffect(() => {
    if (receiverId && token) {
      getMessages();
      getOtherMessager();
    }
  }, [receiverId, token]);

  useEffect(() => {
    messageEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ⚡ HARDENED LIVE WEBSOCKET EVENT TRACKER
  useEffect(() => {
    if (!socket) return;


    const handleIncomingMessage = (newMessage) => {
      
      
      if (newMessage.senderId === receiverId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [socket, receiverId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    try {
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/messages/${receiverId}`, 
        { messageBody }, 
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setMessages((prevMessages) => [...prevMessages, response?.data]);
      setMessageBody('');
    } catch (error) {
      console.error("Transmission failed:", error);
    }
  };

  return (
    <section className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <header className="flex items-center gap-3 p-4 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100 flex-shrink-0">
          <Link to={`/users/${otherMessager?._id}`} className="flex items-center gap-3 group flex-1 min-w-0">
          <ProfileImage image={otherMessager?.profileImg} />
          </Link>
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 truncate">
            {otherMessager?.fullname || "Loading Chat..."}
          </h4>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Active now
          </span>
        </div>
      </header>
      
      <ul className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-1">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-slate-400">Say hi to start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <MessageItem key={message?._id} message={message} />
          ))
        )}
        <div ref={messageEndRef} />
      </ul>

      <form 
        onSubmit={sendMessage} 
        className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
      >
        <input 
          type="text" 
          value={messageBody} 
          onChange={({ target }) => setMessageBody(target.value)} 
          placeholder="Type a message..." 
          autoFocus 
          className="flex-1 min-w-0 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:bg-white focus:border-slate-200 transition-all duration-200"
        />
        <button 
          type="submit" 
          disabled={!messageBody.trim()}
          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-sm"
        >
          <IoMdSend className="w-4 h-4" />
        </button>
      </form>

    </section>
  );
};

export default Messages;