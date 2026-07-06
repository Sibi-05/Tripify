import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FriendRequest from './FriendRequest';

const FriendRequests = () => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?._id || state?.user?.currentUser?.id);

  const getFriends = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const data = response?.data || [];
      const suggestions = data.filter(person => {
        const isSelf = String(person?._id) === String(userId);
        const isAlreadyFollowing = person?.followers?.includes(userId);
        return !isSelf && !isAlreadyFollowing;
      });
      
      setFriends(suggestions);
    } catch (error) {
      console.error("Error fetching suggested friends:", error.message);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getFriends();
  }, [token, userId]);


  const closeFriendBadge = (id) => {
    setFriends((prev) => prev.filter(friend => friend?._id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Suggested Friends
        </h3>
        {friends.length > 0 && (
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
            {friends.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse py-2">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200"></div>
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-slate-200 rounded w-2/3"></div>
                <div className="h-2 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : friends.length > 0 ? (
        <div className="divide-y divide-slate-50 space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-none">
          {friends.map((friend) => (
            <div key={friend?._id} className="pt-2 first:pt-0">
              <FriendRequest 
                friend={friend} 
                onFilterFriend={closeFriendBadge}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            No new suggestions right now.
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendRequests;