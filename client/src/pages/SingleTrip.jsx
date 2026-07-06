import React, { useEffect, useState } from 'react';
import ProfileImage from "../components/ProfileImage";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import TimeAgo from 'react-timeago';
import LikeDislikeTrip from '../components/LikeDislikeTrip';
import { FaRegCommentDots, FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { IoMdSend, IoMdShare } from 'react-icons/io';
import BookMarks from '../components/BookMarks';
import PostComment from "../components/PostComment";

const SingleTrip = () => {
  const { id } = useParams();
  
  const [trip, setTrip] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const getTripComments = async()=>{

    try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/comments/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    setComments(response?.data);
  } catch (error) {
    console.log(error);
  }
  }

  const getTrip = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/trips/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrip(response?.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (cId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${cId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(comments.filter(c => c?._id !== cId));
    } catch (error) {
      console.log(error);
    }
  };

 const createComment = async (e) => {
  e.preventDefault();
  if (!comment.trim()) return;
  
  setIsCommenting(true);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/comments/${id}`,
      { comment },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const newComment = response?.data;
    
    setComments((prevComments) => [newComment, ...prevComments]);
    setComment("");
  } catch (error) {
    console.log(error);
  } finally {
    setIsCommenting(false);
  }
};

  useEffect(() => {
    if (token) {
      getTrip();
      getTripComments();
    }
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 animate-pulse">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-64 bg-slate-200 rounded-xl mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-4">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors duration-200 mb-4 group"
      >
        <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-0.5" />
        <span className="text-xs font-semibold uppercase tracking-wider">Back to Feed</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
        
        <header className="flex items-center gap-3 p-4 border-b border-slate-50">
          <Link to={`/users/${trip?.creator?._id}`} className="flex-shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-slate-100">
              <ProfileImage 
                image={trip?.creator?.profileImg} 
              />
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/users/${trip?.creator?._id}`}>
              <h4 className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors truncate">
                {trip?.creator?.fullname || "User"}
              </h4>
            </Link>
            <small className="text-xs text-slate-400 block mt-0.5">
              <TimeAgo date={trip?.createdAt} />
            </small>
          </div>
        </header>

        <div className="p-4">
          <h1 className="text-xl font-bold text-slate-900 mb-3">
            {trip?.title || "Untitled Trip"}
          </h1>

          <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
              <span className="truncate"><strong>From:</strong> {trip?.startLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-500 flex-shrink-0" />
              <span className="truncate"><strong>To:</strong> {trip?.destination}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 border-t border-slate-200/60 pt-2 mt-1">
              <FaCalendarAlt className="text-blue-400 flex-shrink-0" />
              <span><strong>Timeline:</strong> {trip?.startDate} to {trip?.endDate}</span>
            </div>
          </div>


          <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {trip?.description || "No description provided."}
          </p>

          {trip?.tags && trip.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {trip.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full"
                >
                  <FaTag className="text-[9px] text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {trip?.media && trip.media.length > 0 && (
            <div className="relative group/carousel mb-4">
              <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-xl w-full aspect-[4/5] bg-slate-50 border border-slate-100/50">
                {trip.media.map((item, index) => (
                  <div 
                    key={item?._id || index} 
                    className="w-full h-full flex-shrink-0 snap-center snap-always rounded-xl overflow-hidden relative"
                  >
                    {item?.mediaType === "video" ? (
                      <video 
                        src={item.url} 
                        controls 
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img 
                        src={item.url} 
                        alt={`${trip.title || "Trip attachment"} ${index + 1}`} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>

              {trip.media.length > 1 && (
                <div className="absolute top-3 right-3 bg-slate-900/75 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-semibold rounded-full pointer-events-none shadow-sm tracking-wider">
                  1 / {trip.media.length}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="px-4 py-2 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-1">
            {trip?.likes !== undefined && <LikeDislikeTrip trip={trip} />}
            
            <button className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200">
              <FaRegCommentDots className="w-[18px] h-[18px]" />
              <span className="text-xs font-medium">{comments.length || 0}</span>
            </button>

            <button className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200">
              <IoMdShare className="w-[18px] h-[18px]" />
            </button>
          </div>
          
          <div className="hover:bg-slate-50 rounded-xl p-1 transition-colors">
            <BookMarks trip={trip} />
          </div>
        </footer>

        <div className="px-4 pb-4 pt-4 border-t border-slate-100 bg-slate-50/30">
          
          <form 
            onSubmit={createComment} 
            className="flex items-center gap-2 mb-5"
          >
            <input
              type="text"
              value={comment}
              placeholder="Write a warm response..."
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 min-w-0 bg-white text-slate-800 placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!comment.trim() || isCommenting}
              className="flex-shrink-0 p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {isCommenting ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <IoMdSend className="w-4 h-4" />
              )}
            </button>
          </form>

          {comments.length > 0 ? (
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 scrollbar-none">
              {comments.map((commentItem) => (
                <PostComment 
                  key={commentItem?._id} 
                  comment={commentItem} 
                  onDeleteComment={deleteComment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-white">
              <p className="text-slate-400 text-xs">No responses yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleTrip;