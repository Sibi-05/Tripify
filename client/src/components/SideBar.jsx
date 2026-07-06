import React from 'react'
import { AiOutlineHome } from 'react-icons/ai';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoBookmarksOutline } from "react-icons/io5";
import { FaRegCompass } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";


const SideBar = () => {
  const userId = useSelector(state => state?.user?.currentUser?.id)

  const menuItems = [
    { to: "/", icon: AiOutlineHome, label: "Home" },
    { to: `/explore`, icon: FaRegCompass, label: "Explore" },
    { to: "/newTrip", icon: IoIosAddCircleOutline, label: "Upload" },
    { to: "/bookmarks", icon: IoBookmarksOutline, label: "Bookmarks" },
    { to: "/messages", icon: IoChatbubbleEllipsesOutline, label: "Messages" },
  ]

  return (
    <>

      <menu className="hidden lg:flex flex-col gap-1 w-full">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <i className="flex text-xl">{<item.icon />}</i>
            <p className="text-sm font-medium ">{item.label}</p>
          </NavLink>
        ))}
      </menu>
      

      <menu className="lg:hidden flex items-center justify-around w-full">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
              ${isActive 
                ? "text-black font-extrabold " 
                : "text-gray-500"
              }
            `}
          >
            <i className="flex text-2xl ">{<item.icon />}</i>
            <p className="hidden text-[10px] font-medium">{item.label}</p>
          </NavLink>
        ))}
      </menu>
    </>
  )
}

export default SideBar