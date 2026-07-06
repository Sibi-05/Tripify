import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { HiOutlinePencil, HiOutlineUser } from "react-icons/hi";
import { userActions } from "../store/userSlice";
import { uiSliceActions } from "../store/uiSlice";
import FollowersFollowingModal from "./FollowersFollowingModal";
import axios from "axios";

const UserProfile = () => {
  const { id: userId } = useParams();

  const loggedInUser = useSelector((state) => state.user.currentUser?.id);
  const token = useSelector((state) => state.user.currentUser?.token);
  const currentUser = useSelector((state) => state.user.currentUser);

  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [avatarTouched, setAvatarTouched] = useState(false);
  const [followUser, setFollowUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [showFollowModal, setShowFollowModal] = useState(false);
  const [modalType, setModalType] = useState("followers");

  const dispatch = useDispatch();

  const getUser = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(data);
      setFollowUser(data.followers?.includes(loggedInUser) || false);
      setAvatar(data.profileImg);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      getUser();
    }

    setAvatarTouched(false);
    setAvatar(null);
  }, [userId, token]);

  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    if (!avatar) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("profileImg", avatar);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      dispatch(
        userActions.changeCurrentUser({
          ...currentUser,
          profileImg: data.user.profileImg,
        }),
      );

      setUser(data.user);
      setAvatar(null);
      setAvatarTouched(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update profile image");
    }
  };

  const openEditProfileModel = () => {
    dispatch(uiSliceActions.editProfileModalOpen());
  };

  const followUnFollowUser = async () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data) {
        let updatedFollowers = [];

        if (response.data.user) {
          updatedFollowers = response.data.user.followers || [];
        } else if (response.data.followers) {
          updatedFollowers = response.data.followers;
        } else {
          updatedFollowers = response.data.followers || [];
        }

        const isNowFollowing = updatedFollowers.includes(loggedInUser);

        setFollowUser(isNowFollowing);
        setUser((prev) => ({
          ...prev,
          followers: updatedFollowers,
          following: response.data.user?.following || prev.following,
        }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Follow/Unfollow error:", error);
      alert(error.response?.data?.message || "Failed to update follow status");
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse max-w-xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="flex gap-8 mt-4">
            <div className="w-12 h-10 bg-gray-200 rounded"></div>
            <div className="w-12 h-10 bg-gray-200 rounded"></div>
            <div className="w-12 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user._id === loggedInUser;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-xl mx-auto transition-all duration-300 hover:shadow-md">
      {showFollowModal && (
        <FollowersFollowingModal
          userId={user._id}
          type={modalType}
          onClose={() => setShowFollowModal(false)}
        />
      )}
      <div className="flex flex-col items-center text-center">
        <form
          className="relative group mb-4"
          onSubmit={changeAvatarHandler}
          encType="multipart/form-data"
        >
          <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-50 border-4 border-slate-100 group-hover:border-slate-200 transition-all duration-300 shadow-inner">
            {avatar ? (
              <img
                src={
                  typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                }
                alt={user.fullname || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400">
                <HiOutlineUser />
              </div>
            )}
          </div>

          {isOwnProfile && (
            <>
              {!avatarTouched ? (
                <label
                  htmlFor="avatar"
                  className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-slate-800 transition-all duration-200 shadow-md"
                >
                  <LuUpload className="text-sm" />
                </label>
              ) : (
                <button
                  type="submit"
                  className="absolute bottom-1 right-1 p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-200 shadow-md"
                >
                  <FaCheck className="text-sm" />
                </button>
              )}

              <input
                id="avatar"
                type="file"
                name="profileImg"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAvatar(file);
                    setAvatarTouched(true);
                  }
                }}
              />
            </>
          )}
        </form>

        <h4 className="text-xl font-bold text-slate-800">
          {user.fullname || "User"}
        </h4>

        <div className="w-full mt-6 mb-5">
          <div className="grid grid-cols-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex flex-col items-center justify-center py-5">
              <h3 className="text-2xl font-bold text-slate-900">
                {user?.trips?.length || 0}
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-500 tracking-wide uppercase">
                Trips
              </p>
            </div>

            <div
              className="flex flex-col items-center justify-center py-5 border-x border-slate-200 cursor-pointer"
              onClick={() => {
                setModalType("followers");
                setShowFollowModal(true);
              }}
            >
              <h3 className="text-2xl font-bold text-slate-900">
                {user?.followers?.length || 0}
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-500 tracking-wide uppercase">
                Followers
              </p>
            </div>

            <div
              className="flex flex-col items-center justify-center py-5 cursor-pointer"
              onClick={() => {
                setModalType("following");
                setShowFollowModal(true);
              }}
            >
              <h3 className="text-2xl font-bold text-slate-900">
                {user?.following?.length || 0}
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-500 tracking-wide uppercase">
                Following
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full max-w-sm">
          {isOwnProfile ? (
            <>
              <button
                onClick={openEditProfileModel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 text-sm font-medium shadow-sm"
              >
                <HiOutlinePencil className="text-base" />
                Edit Profile
              </button>

              <Link
                to="/logout"
                className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-100 transition-all duration-200 text-sm font-medium flex items-center justify-center"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={followUnFollowUser}
                disabled={isFollowLoading}
                className={`flex-1 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium shadow-sm ${
                  isFollowLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  followUser
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {isFollowLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                ) : followUser ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>

              <Link
                to={`/messages/${user._id}`}
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-slate-50 text-slate-700 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all duration-200 text-sm font-medium"
              >
                Message
              </Link>
            </>
          )}
        </div>

        {user.bio && (
          <article className="mt-5 pt-4 border-t border-slate-100 w-full text-left">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              About
            </h5>
            <p className="text-slate-600 text-sm leading-relaxed">{user.bio}</p>
          </article>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
