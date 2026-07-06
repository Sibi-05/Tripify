import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateTripForm from '../components/CreateTrip';

const CreateTripPage = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const navigate = useNavigate();

  const createTrip = async (data) => {
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/trips`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const newTrip = response?.data;
      setTrips((prevTrips) => [newTrip, ...prevTrips]);
      navigate('/'); 
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create trip post.");
    }
    finally{
      alert("Uploded")
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-4 mainArea">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl mb-4 shadow-sm">
          {error}
        </div>
      )}

      <CreateTripForm onCreateTrip={createTrip} error={error} />
    </section>
  );
};

export default CreateTripPage;