import React from 'react';
import Feed from '../components/Feed';

const Feeds = ({ trips, onDeleteTrip }) => {
  return (
    <div className="w-full">
      {trips?.length < 1 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[350px] animate-fadeIn">
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-emerald-50 rounded-full animate-ping opacity-25 duration-1000"></div>
            <div className="relative text-6xl select-none animate-bounce duration-700">🧭</div>
          </div>
          
          <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">
            No Journeys Found
          </h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            The horizon is quiet right now. Be the first to share an inspiring itinerary or a hidden spot!
          </p>
        </div>
      ) : (

        <div className="space-y-8 pb-12">
          {trips.map((trip, index) => (
            <div 
              key={trip?._id || index}
              className="transform transition-all duration-500 ease-out animate-slideUp"
              style={{ animationDelay: `${index * 75}ms` }} 
            >
              <Feed trip={trip} onDeleteTrip={onDeleteTrip} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feeds;