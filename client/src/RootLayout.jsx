import React from 'react'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import { Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";
import Widgets from './components/Widgets';
import EditProfileModal from "./components/EditProfileModel";

const RootLayout = () => {
  const editProfileModalOpen = useSelector(
  state => state.ui.editProfileModalOpen
);
  return (
    <>
      <Navbar />
      {editProfileModalOpen && <EditProfileModal />}
      <main className="bg-[#f6f3f0] min-h-screen">
  <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4 lg:py-6">
    <div className="lg:grid lg:grid-cols-[280px_1fr_320px] lg:gap-6">

      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border p-3 sticky top-20 self-start">
        <SideBar />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6 min-h-[70vh]">
        <Outlet />
      </div>

      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border p-4 sticky top-20 self-start">
        <Widgets />
      </div>
    </div>
  </div>

  <div className="lg:hidden fixed bottom-4 left-5 right-5 z-50">
  <div
    className="
      rounded-full
      border border-white/30
      bg-white/15
      backdrop-blur-3xl
      backdrop-saturate-200
      shadow-[0_10px_40px_rgba(0,0,0,0.18)]
      ring-1 ring-white/20
      overflow-hidden
      relative
    "
  >
        <div className="absolute -inset-[1px] rounded-full bg-white/10 blur-xl pointer-events-none"></div>
    {/* Glass Highlight */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

    {/* Navigation */}
    <div className="relative px-2 py-2">
      <SideBar />
    </div>
  </div>
</div>
</main>
    </>
  )
}

export default RootLayout