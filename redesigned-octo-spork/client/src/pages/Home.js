
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-main">
      <div className="w-full max-w-xl mx-auto px-6 py-16 rounded-2xl shadow-xl bg-dark-card text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Lukie's Streams
        </h1>
        <p className="text-lg text-gray-400 mb-10">
          Minimal movies & live streaming. Enjoy entertainment, simply.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/movies"
            className="w-full py-3 rounded-lg bg-primary-700 text-white font-semibold hover:bg-primary-600 transition-colors"
          >
            Browse Movies
          </Link>
          <Link
            to="/live"
            className="w-full py-3 rounded-lg bg-gray-900 text-white font-semibold border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            Watch Live
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;