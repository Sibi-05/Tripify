import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import CreateTrip from '../components/CreateTrip.jsx';
import axios from "axios";
import Feeds from './Feeds.jsx';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const token = useSelector((state) => state?.user?.currentUser?.token);


  const getTrips = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/trips`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrips(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong loading feeds.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getTrips();
    }
  }, [token]);

  return (
    <section className=" max-w-2xl mx-auto p-4 space-y-6 mainArea">

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl shadow-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className=" space-y-4 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white border border-slate-100 h-48 rounded-2xl p-4">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-2 bg-slate-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <Feeds trips={trips} />
      )}
    </section>
  );
};

export default Home;