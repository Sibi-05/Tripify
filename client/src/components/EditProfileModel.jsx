import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiSliceActions } from '../store/uiSlice'
import { userActions } from '../store/userSlice'
import axios from 'axios'
import { HiX, HiOutlineUser, HiOutlinePencil, HiOutlineLocationMarker } from 'react-icons/hi'

const EditProfileModal = () => {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    
    const token = useSelector(state => state?.user?.currentUser?.token);
    const id = useSelector(state => state?.user?.currentUser?.id);
    const currentUser = useSelector(state => state?.user?.currentUser);
    const dispatch = useDispatch();

    const getUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserData(response?.data);
            setAvatarPreview(response?.data?.profileImg);
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const closeModal = (e) => {

        if (e.target.classList.contains("modal-overlay")) {
            dispatch(uiSliceActions.closeEditProfileModal());
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            

            const response = await axios.patch(
  `${import.meta.env.VITE_API_URL}/users/${id}`,
  {
    fullname: userData.fullname,
    bio: userData.bio,
    location: userData.location,
  },
  {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
            
            const updatedUser = response?.data;
            
            dispatch(
                userActions.changeCurrentUser({
                    ...currentUser,
                    ...updatedUser,
                    profileImg: updatedUser?.profileImg || currentUser?.profileImg
                })
            );

            dispatch(uiSliceActions.closeEditProfileModal());
            
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const changeUserData = (e) => {
        setUserData(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };


    useEffect(() => {
        getUser();
    }, []);

    return (
        <section 
            className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
            onClick={closeModal}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scaleIn">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
                    <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                    <button 
                        onClick={() => dispatch(uiSliceActions.closeEditProfileModal())}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        <HiX className="text-xl text-gray-500" />
                    </button>
                </div>

                <form onSubmit={updateUser} className="p-5 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={userData?.fullname || ''}
                            onChange={changeUserData}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            <HiOutlineLocationMarker className="inline mr-1" />
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={userData?.location || ''}
                            onChange={changeUserData}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="Where are you from?"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={userData?.bio || ''}
                            onChange={changeUserData}
                            rows="4"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-sm resize-none"
                            placeholder="Tell us about yourself..."
                            maxLength="150"
                        />
                        <p className="text-xs text-gray-500 mt-1 text-right">
                            {userData?.bio?.length || 0}/150 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => dispatch(uiSliceActions.closeEditProfileModal())}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default EditProfileModal;