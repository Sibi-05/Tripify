import React from "react";
import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-6">
          <FaCompass className="text-4xl text-slate-800" />
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-extrabold text-slate-900">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-bold text-slate-800">
          Lost on your journey?
        </h2>

        {/* Description */}
        <p className="mt-3 text-slate-500 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on the right path.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md"
          >
            Go Home
          </Link>

          <Link
            to="/explore"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all"
          >
            Explore Trips
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;