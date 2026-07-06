import React, { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { useSocket } from '../context/SocketContext.jsx'; 

const LikeDislikeTrip = ({ trip: initialTrip }) => {
  const [trip, setTrip] = useState(initialTrip);
  const [tripLiked, setTripLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const userId = useSelector((state) => state?.user?.currentUser?._id || state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  
  const socket = useSocket();

  useEffect(() => {
    setTrip(initialTrip);
  }, [initialTrip]);

  useEffect(() => {
    if (userId && trip?.likes) {
      const hasLiked = trip.likes.includes(userId);
      setTripLiked(hasLiked);
    } else {
      setTripLiked(false);
    }
  }, [trip, userId]);


  useEffect(() => {
    if (!socket || !trip?._id) return;

    const handleIncomingLikePayload = (data) => {

      if (data.tripId === trip._id) {
        
        setTrip((prev) => {

          if (data.likesArray) {
            return { ...prev, likes: data.likesArray };
          }
          
          const alreadyContains = prev?.likes?.includes(data.likedBy);
          let fallbackLikes = prev?.likes || [];
          
          if (data.isLikedNow && !alreadyContains) {
            fallbackLikes = [...fallbackLikes, data.likedBy];
          } else if (!data.isLikedNow && alreadyContains) {
            fallbackLikes = fallbackLikes.filter((id) => id !== data.likedBy);
          }
          
          return { ...prev, likes: fallbackLikes };
        });
      }
    };

    socket.on("tripLiked", handleIncomingLikePayload);
    socket.on("globalTripUpdate", handleIncomingLikePayload);

    return () => {
      socket.off("tripLiked", handleIncomingLikePayload);
      socket.off("globalTripUpdate", handleIncomingLikePayload);
    };
  }, [socket, trip?._id]);

  const handleLikeTrip = async () => {
    if (!token || isLiking) return;

    setIsLiking(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/trips/${trip?._id}/like`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data) {
        setTrip(response.data);
      } else {
        setTrip((prev) => {
          const alreadyLiked = prev?.likes?.includes(userId);
          const updatedLikes = alreadyLiked
            ? prev.likes.filter((id) => id !== userId)
            : [...(prev?.likes || []), userId];
          return { ...prev, likes: updatedLikes };
        });
      }
    } catch (error) {
      console.error("Error liking/unliking trip:", error.message);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button 
      onClick={handleLikeTrip}
      disabled={isLiking}
      className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 disabled:opacity-70 cursor-pointer"
      title={tripLiked ? "Unlike trip" : "Like trip"}
    >
      {tripLiked ? (
        <FcLike className="w-[18px] h-[18px] animate-pulse" />
      ) : (
        <FaRegHeart className="w-[18px] h-[18px] text-slate-500 transition-transform active:scale-120" />
      )}
      <span className="text-xs font-medium text-slate-600">
        {trip?.likes?.length || 0}
      </span>
    </button>
  );
};

export default LikeDislikeTrip;