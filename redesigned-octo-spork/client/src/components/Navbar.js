import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FilmIcon, 
  VideoCameraIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <FilmIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Lukie's Streams
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/movies" 
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <FilmIcon className="w-4 h-4" />
              <span>Movies</span>
            </Link>
            <Link 
              to="/live" 
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <VideoCameraIcon className="w-4 h-4" />
              <span>Live</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;