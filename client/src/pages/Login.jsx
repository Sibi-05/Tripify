import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import axios from "axios";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        userData
      );
      if (response.status === 200) {
        dispatch(userActions.changeCurrentUser(response.data));
        localStorage.setItem("currentUser", JSON.stringify(response.data));
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbf7] via-[#f6f3f0] to-[#eaddd3] px-4 py-12 antialiased">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white  font-bold text-xl">Ti</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Please enter your details to sign in</p>
        </div>

        <form onSubmit={loginUser} className="space-y-5">

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}

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

          <p className="text-sm text-slate-500 text-center pt-1">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors underline underline-offset-4">
              Sign Up
            </Link>
          </p>

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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;