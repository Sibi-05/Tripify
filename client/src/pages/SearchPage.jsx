import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaSearch, FaTimes, FaMapMarkerAlt, FaCompass } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { AiFillMessage } from "react-icons/ai";
import axios from "axios";
import ProfileImage from "../components/ProfileImage";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trips");
  const [trendingTrips, setTrendingTrips] = useState([]);
  const [searchResults, setSearchResults] = useState({ users: [], trips: [] });
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state?.user?.currentUser?.token);

  useEffect(() => {
    const fetchDiscoveryGrid = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/trips`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTrendingTrips(response.data || []);
      } catch (err) {
        console.error("Discovery error", err);
      }
    };
    if (token) fetchDiscoveryGrid();
  }, [token]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], trips: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = response.data || { users: [], trips: [] };
        setSearchResults(data);

        if (
          data.trips?.length === 0 &&
          data.users?.length > 0 &&
          activeTab === "trips"
        ) {
          setActiveTab("people");
        } else if (
          data.users?.length === 0 &&
          data.trips?.length > 0 &&
          activeTab === "people"
        ) {
          setActiveTab("trips");
        }
      } catch (error) {
        console.error("Search query error", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);
  return (
    <section className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      <div className="relative w-full max-w-lg mx-auto">
        <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for people or travel trips..."
          className="w-full bg-slate-100 text-sm pl-11 pr-10 py-3 rounded-2xl border-none focus:outline-none focus:bg-slate-50 focus:ring-2 focus:ring-slate-200 transition-all placeholder:text-slate-400 text-slate-800"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        )}
      </div>

      {searchQuery.trim() ? (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex border-b border-slate-100 gap-6 justify-center">
            {["trips", "people"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100/80 p-2 shadow-sm min-h-[300px]">
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {activeTab === "trips" && (
                  <>
                    {searchResults.trips?.map((trip) => (
                      <Link
                        key={trip._id}
                        to={`/trips/${trip._id}`}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 transition-colors rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                          {trip.media?.[0]?.url ? (
                            <img
                              src={trip.media[0].url}
                              alt={trip.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaCompass className="text-lg text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {trip.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <FaMapMarkerAlt className="text-[10px] text-emerald-500" />
                            {trip.startLocation || "Unknown"} →{" "}
                            {trip.destination}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.trips?.length === 0 && (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No matching trips found.
                      </div>
                    )}
                  </>
                )}

                {activeTab === "people" && (
                  <>
                    {searchResults.users?.map((user) => (
                      <Link
                        key={user._id}
                        to={`/users/${user._id}`}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors rounded-xl"
                      >
                        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                          <ProfileImage image={user.profileImg} />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            @{user.username || "user"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {user.fullname}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.users?.length === 0 && (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No matching creators found.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Explore Stories
          </h3>

          <div className="grid grid-cols-3 gap-1 sm:gap-2 auto-rows-fr rounded-xl overflow-hidden">
            {trendingTrips.map((trip, idx) => {
              const hasMedia = trip?.media && trip.media.length > 0;
              const isLarge = idx % 5 === 0;

              return (
                <Link
                  key={trip._id || idx}
                  to={`/trips/${trip._id}`}
                  className={`relative group bg-slate-50 rounded-lg overflow-hidden border border-slate-100/40 ${
                    isLarge
                      ? "col-span-2 row-span-2 h-full min-h-[160px] sm:min-h-[240px]"
                      : "aspect-square w-full h-full"
                  }`}
                >
                  {hasMedia ? (
                    trip.media[0].mediaType === "video" ? (
                      <video
                        src={trip.media[0].url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={trip.media[0].url}
                        alt="Explore item"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )
                  ) : (
                    /* ✅ FIX 3: Re-structured flex dimensions so fallbacks maintain grid proportions perfectly */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-white text-center">
                      <span className="text-base sm:text-xl mb-0.5 sm:mb-1">
                        🌍
                      </span>
                      <p className="text-slate-700 font-semibold text-[9px] sm:text-[11px] line-clamp-2 px-1 leading-tight">
                        {trip.title}
                      </p>
                    </div>
                  )}

                  {/* Hover Details Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 pointer-events-none">
                    <div className="flex items-center gap-5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-lg border border-white/20 text-white">
                      <div className="flex items-center gap-1.5">
                        <FcLike className="text-lg" />
                        <span className="text-sm font-medium">
                          {trip.likes?.length || 0}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <AiFillMessage className="text-lg" />
                        <span className="text-sm font-medium">
                          {trip.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchPage;
