import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayIcon, 
  StarIcon,
  MagnifyingGlassIcon,
  FilmIcon
} from '@heroicons/react/24/outline';

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get('/api/movies/popular');
      setMovies(response.data.movies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      fetchPopularMovies();
      return;
    }

    try {
      const response = await axios.get(`/api/movies/search?query=${query}`);
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(searchQuery);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-dark-main flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading movies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Movies</h1>
          <p className="text-gray-400">Discover and watch your favorite movies</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-dark-card border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:border-primary-700"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </form>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <FilmIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No movies found</h3>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-dark-card rounded-2xl overflow-hidden card-hover cursor-pointer group shadow-xl"
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] bg-dark-main">
                  {movie.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FilmIcon className="w-12 h-12 text-gray-700" />
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <div className="bg-primary-700 rounded-full p-3">
                      <PlayIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-600 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {movie.overview}
                  </p>
                  {/* Movie Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-3 h-3 text-yellow-500" />
                      <span>{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;