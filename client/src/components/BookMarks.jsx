import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import axios from 'axios';

const BookMarks = ({ trip }) => {
  const userId = useSelector(state => state?.user?.currentUser?.id);
  const token = useSelector(state => state?.user?.currentUser?.token);
  
  const [tripBookmarked, setTripBookmarked] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    const checkInitialStatus = async () => {
      if (!userId || !token) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const bookmarks = response?.data?.bookmarks || [];
        const isSaved = bookmarks.some(b => (typeof b === 'object' ? b._id === trip?._id : b === trip?._id));
        setTripBookmarked(isSaved);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkInitialStatus();
  }, [userId, token, trip?._id]);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMutating) return;
    
    setIsMutating(true);
    setTripBookmarked(prev => !prev);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/trips/${trip?._id}/bookmark`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedBookmarks = response?.data?.bookmarks || [];
      const verifySaved = updatedBookmarks.includes(trip?._id);
      setTripBookmarked(verifySaved);
    } catch (error) {
      console.error("Mutation error, rolling back state:", error);
      setTripBookmarked(prev => !prev); 
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleBookmarkToggle}
      disabled={isMutating}
      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
        tripBookmarked 
          ? 'text-blue-600 hover:bg-blue-50' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
      }`}
      aria-label={tripBookmarked ? "Remove bookmark" : "Bookmark trip"}
    >
      {tripBookmarked ? (
        <FaBookmark className="w-[18px] h-[18px] animate-scaleIn" />
      ) : (
        <FaRegBookmark className="w-[18px] h-[18px]" />
      )}
    </button>
  );
};

export default BookMarks;