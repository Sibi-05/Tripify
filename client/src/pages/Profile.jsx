import React, { useEffect, useState } from 'react';
import UserProfile from '../components/UserProfile';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import EditTripModal from '../components/EditTripModal';
import Feed from '../components/Feed';
import { HiOutlinePlus } from 'react-icons/hi';

const Profile = () => {
  const [user, setUser] = useState({});
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const token = useSelector((state) => state.user.currentUser?.token);
  const currentUserId = useSelector((state) => state.user.currentUser?.id);
  const editTripModalOpen = useSelector((state) => state?.ui?.openEditTripModal);
  const editTripId = useSelector((state) => state?.ui?.editTripId);
  
  const { id: userId } = useParams();
  const isOwnProfile = currentUserId === userId;

  const fetchProfileDashboard = async () => {
    setIsLoading(true);
    try {
      const [profileRes, tripsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUser(profileRes?.data || {});
      setUserTrips(Array.isArray(tripsRes?.data) ? tripsRes.data : tripsRes?.data?.trips || []);
    } catch (error) {
      console.error("Dashboard resolution crash:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/trips/${tripId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserTrips(prev => prev.filter(trip => trip?._id !== tripId));
    } catch (error) {
      console.error("Deletion error:", error);
    }
  };

  const updateTrip = async (formData) => {
    if (!editTripId) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/trips/${editTripId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const updatedTrip = response.data?.trip || response.data;
        setUserTrips(prev => prev.map(t => t._id === updatedTrip._id ? updatedTrip : t));
      }
    } catch (error) {
      console.error("Modal compilation patch failure:", error);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchProfileDashboard();
    }
  }, [userId, token]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-72 bg-gray-50/50"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      
      <UserProfile user={user} isOwnProfile={isOwnProfile} />


      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Shared Journeys</h2>
          <p className="text-xs text-gray-400">{userTrips.length} published records</p>
        </div>

        {isOwnProfile && (
          <Link
            to="/newTrip" 
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-xs font-semibold shadow-sm"
          >
            <HiOutlinePlus className="text-base" />
            <span>Create Trip</span>
          </Link>
        )}
      </div>

      {userTrips.length < 1 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="text-5xl mb-3">🧭</div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">No Adventures Documented</h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
            {isOwnProfile 
              ? "The map is empty. Tap create below to chronicle your first global destination itinerary!" 
              : `${user?.fullname || 'This explorer'} has not mapped any public trips yet.`}
          </p>
          {isOwnProfile && (
            <Link
              to="/newTrip" 
              className="inline-block mt-4 px-5 py-2.5 bg-gray-950 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              Start Your First Log
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {userTrips.map((trip) => (
            <Feed
              key={trip?._id}
              trip={trip}
              onDeleteTrip={deleteTrip}
            />
          ))}
        </div>
      )}

      {editTripModalOpen && <EditTripModal onUpdateTrip={updateTrip} />}
    </section>
  );
};

export default Profile;