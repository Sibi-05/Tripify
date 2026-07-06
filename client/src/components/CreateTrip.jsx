import React, { useState } from 'react';
import ProfileImage from "./ProfileImage";
import { useSelector } from 'react-redux';
import { SlPicture } from 'react-icons/sl';
import { FaMapMarkerAlt, FaCalendarAlt, FaHeading, FaTags, FaTimes } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom'

const CreateTrip = ({ onCreateTrip, error }) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  

  const [mediaFiles, setMediaFiles] = useState([]); 
  const [mediaPreviews, setMediaPreviews] = useState([]); 

  const profileImg = useSelector(state => state?.user?.currentUser?.profileImg);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newPreviews = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));

    setMediaFiles(prev => [...prev, ...selectedFiles]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMediaItem = (indexToRemove) => {
    URL.revokeObjectURL(mediaPreviews[indexToRemove].url);

    setMediaFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setMediaPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAllMedia = () => {
    mediaPreviews.forEach(item => URL.revokeObjectURL(item.url));
    setMediaFiles([]);
    setMediaPreviews([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startLocation', startLocation);
    formData.append('destination', destination);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    
    tagsArray.forEach((tag) => formData.append('tags', tag));

    if (mediaFiles.length > 0) {
      mediaFiles.forEach((file, index) => {
        formData.append('media', file); 
      });
    }

    

    onCreateTrip(formData);

    setTitle("");
    setDescription("");
    setStartLocation("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setTagsInput("");
    clearAllMedia();
    navigate('/')
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <ProfileImage image={profileImg} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Share a New Journey</h3>
          <p className="text-xs text-slate-400">Where did you wander off to?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-3">
        <div className="relative">
          <FaHeading className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input 
            type="text"
            required
            placeholder="Give your trip an inspiring title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3.5 top-3 text-red-400 text-xs" />
            <input 
              type="text"
              required
              placeholder="Starting point"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
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
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
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
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs pl-14 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-600"
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
              className="w-full text-xs pl-12 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-600"
            />
          </div>
        </div>

        <textarea 
          required
          rows="3"
          placeholder="Describe your itinerary, experiences, hidden spots, or food suggestions..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400 resize-none"
        ></textarea>

        <div className="relative">
          <FaTags className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input 
            type="text"
            placeholder="Tags (separated by commas: solo, budget, hiking)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
          />
        </div>

        {mediaPreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            {mediaPreviews.map((media, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden bg-white aspect-video border border-slate-200 flex items-center justify-center group shadow-sm">
                {media.type === "video" ? (
                  <video src={media.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={media.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                )}
                
                <button
                  type="button"
                  onClick={() => removeMediaItem(idx)}
                  className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors shadow-md z-10"
                  title="Remove image"
                >
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
          <div>
            <label 
              htmlFor="trip-media" 
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl cursor-pointer text-xs font-medium border border-slate-200/60 transition-all"
            >
              <SlPicture className="w-4 h-4 text-emerald-500" />
              <span>Add Photos/Videos</span>
            </label>
            <input 
              type="file" 
              id="trip-media" 
              accept="image/*,video/*"
              multiple 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          <button 
            type="submit"
            className="px-5 py-2 bg-slate-950 text-white font-medium text-xs rounded-xl hover:bg-slate-800 transition-all shadow-sm"
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;