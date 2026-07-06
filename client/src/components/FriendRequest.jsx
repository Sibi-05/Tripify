import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileImage from './ProfileImage';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import { IoPersonAdd } from "react-icons/io5";
import { IoMdClose } from 'react-icons/io';

const FriendRequest = ({ friend, onFilterFriend }) => {
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const followUser = async () => {
    if (!token) return;
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${friend?._id}/follow-unfollow`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      onFilterFriend(friend?._id);
    } catch (error) {
      console.error("Error following user:", error.message);
    }
  };

  return (
    <article className="flex items-center justify-between gap-3 py-2 bg-white rounded-xl transition-all">
      {/* Left Area */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <Link 
          to={`/users/${friend?._id}`} 
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-100 hover:opacity-90 transition-opacity"
        >
          <ProfileImage image={friend?.profileImg} />
        </Link>
        
        <div className="min-w-0 flex-1">
          <Link to={`/users/${friend?._id}`} className="block group">
            <h5 className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
              {friend?.fullname || "Anonymous User"}
            </h5>
          </Link>
          <span className="text-[10px] text-slate-400 block truncate">
            Suggested for you
          </span>
        </div>
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button 
          onClick={followUser}
          className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
          title="Follow user"
        >
          <IoPersonAdd  className="w-3 h-3" />
        </button>

        <button 
          onClick={() => onFilterFriend(friend?._id)}
          className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-50 hover:border-red-100 active:scale-95 transition-all"
          title="Dismiss suggestion"
        >
          <IoMdClose className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};

export default FriendRequest;