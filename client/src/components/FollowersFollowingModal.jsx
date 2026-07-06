import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTimes, FaUserFriends } from "react-icons/fa";
import ProfileImage from "./ProfileImage";

const FollowersFollowingModal = ({
  userId,
  type,
  onClose,
}) => {
  const token = useSelector((state) => state.user.currentUser?.token);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/follow-list?type=${type}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(data.users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [type, userId]);

  const closeModal = (e) => {
    if (e.target.classList.contains("followModal")) {
      onClose();
    }
  };

  return (
    <div
      className="followModal fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg capitalize">
            {type}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}

        <div className="max-h-[450px] overflow-y-auto">

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-400">

              <FaUserFriends className="text-5xl mb-4" />

              <h3 className="font-semibold">
                No {type}
              </h3>

            </div>
          ) : (
            users.map((user) => (
              <Link
                key={user._id}
                to={`/users/${user._id}`}
                onClick={onClose}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12">
                  <ProfileImage image={user.profileImg} />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {user.fullname}
                  </h4>

                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingModal;