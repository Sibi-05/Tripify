import React from 'react';
import FriendRequests from './FriendRequests';
import MessagesList from './MessagesList';

const Widgets = () => {
  return (
    <section className="hidden lg:flex flex-col w-full space-y-4">
      
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Activity Dashboard
        </h3>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden divide-y divide-slate-100/60">
        
        <div className="p-4 transition-colors duration-200 hover:bg-slate-50/40">
          <FriendRequests />
        </div>

        <div className="p-4 transition-colors duration-200 hover:bg-slate-50/40">
          <MessagesList />
        </div>

      </div>
    </section>
  );
};

export default Widgets;