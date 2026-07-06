import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    location:"",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        userData
      );

      if (response.status === 201 || response.status === 200 || response.statusText === "OK") {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbf7] via-[#f6f3f0] to-[#eaddd3] px-4 py-12 antialiased">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
        
        {/* Header Block Matching Login */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white font-bold text-xl">Ti</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400 mt-1">Join us to start planning your journeys</p>
        </div>

        <form onSubmit={registerUser} className="space-y-5">

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}

          {/* Full Name Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="John Doe"
              value={userData.fullname}
              onChange={changeInputHandler}
              required
              autoFocus
              className="w-full bg-white/50 text-slate-800 placeholder-slate-400 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200"
            />
          </div>

          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={userData.email}
              onChange={changeInputHandler}
              required
              className="w-full bg-white/50 text-slate-800 placeholder-slate-400 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Location</label>
            <input
              type="location"
              name="location"
              placeholder="place"
              value={userData.location}
              onChange={changeInputHandler}
              required
              className="w-full bg-white/50 text-slate-800 placeholder-slate-400 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200"
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={userData.password}
                onChange={changeInputHandler}
                required
                className="w-full bg-white/50 text-slate-800 placeholder-slate-400 text-sm pl-4 pr-11 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors focus:outline-none"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={userData.confirmPassword}
                onChange={changeInputHandler}
                required
                className="w-full bg-white/50 text-slate-800 placeholder-slate-400 text-sm pl-4 pr-11 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors focus:outline-none"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Redirect Sub-text */}
          <p className="text-sm text-slate-500 text-center pt-1">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors underline underline-offset-4">
              Sign In
            </Link>
          </p>

          {/* Animated Submit Button Wrapper */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white rounded-xl py-3 text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;