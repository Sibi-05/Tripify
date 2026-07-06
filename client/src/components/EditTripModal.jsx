import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uiSliceActions } from '../store/uiSlice';
import { FaMapMarkerAlt, FaHeading, FaTags, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const EditTripModal = ({ onUpdateTrip }) => {
  const editTripId = useSelector(state => state?.ui?.editTripId);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const dispatch = useDispatch();

  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 
  const getTrip = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/trips/${editTripId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const trip = response?.data?.trip || response?.data;
      if (trip) {
        setTitle(trip.title || "");
        setDescription(trip.description || "");
        setStartLocation(trip.startLocation || "");
        setDestination(trip.destination || "");
        setStartDate(trip.startDate || "");
        setEndDate(trip.endDate || "");
        
        setTagsInput(Array.isArray(trip.tags) ? trip.tags.join(', ') : trip.tags || "");
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && newStartDate > endDate) {
      setEndDate("");
    }
  };


  const updateTrip = async (e) => {
    e.preventDefault(); 
    
    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const formData = {
    title,
    description,
    startLocation,
    destination,
    startDate,
    endDate,
    tags: tagsInput.split(",").map(tag => tag.trim())
}
console.log(formData)
    onUpdateTrip(formData,editTripId);
    dispatch(uiSliceActions?.closeEditTripModal());
  };

  const closeEditTripModel = (e) => {
    if (e.target.classList.contains('editTripOverlay')) {
      dispatch(uiSliceActions?.closeEditTripModal());
    }
  };

  useEffect(() => {
    if (editTripId) {
      getTrip();
    }
  }, [editTripId]);

  return (
    <div 
      className="editTripOverlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn"
      onClick={closeEditTripModel}
    >
      <form 
        onSubmit={updateTrip} 
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-100 flex flex-col my-8 animate-scaleIn overflow-hidden"
      >
  
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Edit Journey Details</h3>
            <p className="text-xs text-slate-400">Modify any field of your shared itinerary below.</p>
          </div>
          <button 
            type="button"
            onClick={() => dispatch(uiSliceActions?.closeEditTripModal())}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="relative">
                <FaHeading className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                <input 
                  type="text"
                  required
                  placeholder="Give your trip an inspiring title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Locations Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-3 text-red-400 text-xs" />
                  <input 
                    type="text"
                    required
                    placeholder="Starting point"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-3 text-emerald-500 text-xs" />
                  <input 
                    type="text"
                    required
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

         
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">Start:</span>
                  <input 
                    type="date"
                    required
                    value={startDate}
                    max={endDate}
                    onChange={handleStartDateChange}
                    className="w-full text-xs pl-14 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-700"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">End:</span>
                  <input 
                    type="date"
                    required
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs pl-12 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-700"
                  />
                </div>
              </div>

         
              <textarea 
                required
                rows="4"
                placeholder="Describe your itinerary, experiences, hidden spots, or food suggestions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-700 placeholder:text-slate-400 resize-none leading-relaxed"
              ></textarea>

              <div className="relative">
                <FaTags className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                <input 
                  type="text"
                  placeholder="Tags (separated by commas: solo, budget, hiking)"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </>
          )}
        </div>

        
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <button 
            type="button"
            onClick={() => dispatch(uiSliceActions?.closeEditTripModal())}
            className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-5 py-2 bg-slate-950 text-white font-medium text-xs rounded-xl hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTripModal;