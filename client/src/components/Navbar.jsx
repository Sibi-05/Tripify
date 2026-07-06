import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ProfileImage from "./ProfileImage";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const profileImg = useSelector(
    (state) => state?.user?.currentUser?.profileImg,
  );

  const getUser = async () => {
    if (!userId || !token) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser(response?.data);
    } catch (error) {
      console.error(
        "Navbar profile load error:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    getUser();
  }, [userId, token, profileImg]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            Tripify
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">

            {!token ? (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-sm"
            >
              Login
            </Link>
          ):(
            <Link
              to={`/users/${userId}`}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-gray-300 transition-all duration-200">
                <ProfileImage image={user?.profileImg || profileImg} />
              </div>
              <span className="hidden sm:block text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                {user?.fullname || "Profile"}
              </span>
            </Link>)}
          </div>

          {!token && (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
