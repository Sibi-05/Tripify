import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { FaRegCommentDots } from "react-icons/fa";
import LikeDislikeTrip from "./LikeDislikeTrip";
import { IoMdShare } from "react-icons/io";
import TimeAgo from "react-timeago";
import TrimText from "../helpers/TrimText";
import BookMarks from "./BookMarks";
import { uiSliceActions } from "../store/uiSlice";
import { HiDotsHorizontal } from "react-icons/hi";

import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const Feed = ({ trip, onDeleteTrip }) => {
  const [creator, setCreator] = useState({});
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const dispatch = useDispatch();
  const location = useLocation();
  const menuRef = useRef(null);

  const getTripCreator = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${trip?.creator}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCreator(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (trip?.creator) getTripCreator();
  }, [trip?.creator]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowFeedHeaderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showEditTripModel = () => {
    dispatch(uiSliceActions?.openEditTripModal(trip?._id));
    setShowFeedHeaderMenu(false);
  };

  const deleteTrip = () => {
    onDeleteTrip(trip?._id);
    setShowFeedHeaderMenu(false);
  };

  const shareTrip = async () => {
    const tripUrl = `${window.location.origin}/trips/${trip?._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: trip?.title || "Check out this trip!",
          url: tripUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(tripUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (error) {
        console.error("Could not copy link:", error);
      }
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden w-full max-w-[600px] mx-auto">
      <header
        className="flex items-center justify-between px-5 py-4 h-[72px] min-h-[72px]"
        ref={menuRef}
      >
        <Link
          to={`/users/${trip.creator}`}
          className="flex items-center gap-3 group flex-1 min-w-0"
        >
          <div className="flex-shrink-0 w-11 h-11">
            <ProfileImage
              image={creator?.profileImg}
              className="w-11 h-11 rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
              {creator?.fullname || "Loading..."}
            </h4>
            <small className="text-xs text-gray-500">
              <TimeAgo date={trip?.createdAt} />
            </small>
          </div>
        </Link>

        {userId === trip?.creator && location.pathname.includes("users") && (
          <div className="relative flex-shrink-0 ml-2">
            <button
              onClick={() => setShowFeedHeaderMenu(!showFeedHeaderMenu)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 w-9 h-9 flex items-center justify-center"
            >
              <HiDotsHorizontal className="text-gray-600 text-xl" />
            </button>

            {showFeedHeaderMenu && (
              <menu className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[120px] z-10">
                <button
                  onClick={showEditTripModel}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={deleteTrip}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  Delete
                </button>
              </menu>
            )}
          </div>
        )}
      </header>

      <Link
        to={`/trips/${trip?._id}`}
        className="block px-5 py-2 hover:bg-slate-50 transition-all"
      >
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {trip?.title}
          </h3>

          <p className="text-sm text-slate-600 leading-6 line-clamp-3">
            <TrimText item={trip?.description} maxLength={160} />
          </p>
        </div>
      </Link>

      {trip?.media && trip.media.length > 0 && (
        <div className="relative group/carousel px-5 mb-3">
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-xl w-full aspect-square bg-gray-50">
            {trip.media.map((item, index) => (
              <div
                key={item?._id || index}
                className="w-full aspect-square flex-shrink-0 snap-center snap-always rounded-xl overflow-hidden relative"
              >
                {item?.mediaType === "video" ? (
                  <div className="relative w-full h-full">
  <video
    ref={videoRef}
    src={item.url}
    className="w-full h-full object-cover cursor-pointer"
    muted={isMuted}
    playsInline
    onClick={togglePlay}
  />

  {!isPlaying && (
    <button
      onClick={togglePlay}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
        <FaPlay className="text-3xl ml-1" />
      </div>
    </button>
  )}

  <button
    onClick={toggleMute}
    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-all"
  >
    {isMuted ? (
      <FaVolumeMute className="text-lg" />
    ) : (
      <FaVolumeUp className="text-lg" />
    )}
  </button>
</div>
                ) : (
                  <img
                    src={item.url}
                    alt={`Trip media ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>

          {trip.media.length > 1 && (
            <div className="absolute top-3 right-8 bg-slate-900/75 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] font-semibold rounded-full pointer-events-none shadow-sm tracking-wider">
              1 / {trip.media.length}
            </div>
          )}
        </div>
      )}

      <footer className="px-5 py-3 border-t border-gray-100 h-[56px] min-h-[56px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <LikeDislikeTrip trip={trip} />

            <Link
              to={`/trips/${trip?._id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
            >
              <FaRegCommentDots className="text-lg" />
              <small className="text-sm font-medium min-w-[20px] text-center">
                {trip?.comments?.length || 0}
              </small>
            </Link>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
              onClick={shareTrip}
            >
              <IoMdShare className="text-lg" />
            </button>
          </div>

          <div className="hover:cursor-pointer">
            <BookMarks trip={trip} />
          </div>
        </div>
      </footer>
    </article>
  );
};

export default Feed;
