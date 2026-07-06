import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Feed from '../components/Feed';
import axios from 'axios';
import FeedSkeleton from '../components/FeedSkeleton';
import HeaderInfo from '../components/HeaderInfo';

const BookMarks = () => {
  const [bookMarks, setBookMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(state => state?.user?.currentUser?.token);

  const getBookMarks = async () => {
    setIsLoading(true); 
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/bookmarks`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookMarks(response?.data?.bookmarks || response?.data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalDelete = (tripId) => {
    setBookMarks(prev => prev.filter(b => b?._id !== tripId));
  };

  useEffect(() => {
    if (token) {
      getBookMarks();
    }
  }, [token]);

  return (
    <section className="w-full max-w-[600px] mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-100">
        <HeaderInfo text="Saved Collections" />
        <p className="text-xs text-slate-400 mt-0.5">Your curated list of wanderlust inspiration and itineraries.</p>
      </div>

      {isLoading ? (
        <FeedSkeleton />
      ) : bookMarks?.length < 1 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[320px] animate-fadeIn">
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-blue-50 rounded-full animate-pulse opacity-60"></div>
            <div className="relative text-5xl select-none">📌</div>
          </div>
          
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">
            Your Board is Empty
          </h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Tap the bookmark emblem on shared journey posts to save inspiring destinations here for later.
          </p>
        </div>
      ) : (
   
        <div className="space-y-6 pb-12 animate-slideUp">
          {bookMarks.map((bookmarkItem) => (
            <Feed 
              key={bookmarkItem?._id} 
              trip={bookmarkItem} 
              onDeleteTrip={handleLocalDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookMarks;