import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeftIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const MoviePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const updateWatchHistory = useCallback((movieData) => {
    if (typeof window === 'undefined' || !movieData) {
      return;
    }

    try {
      const stored = localStorage.getItem('watchedMovies');
      const history = stored ? JSON.parse(stored) : [];

      const filteredHistory = history.filter((item) => item.id !== movieData.id);
      const entry = {
        id: movieData.id,
        title: movieData.title,
        posterPath: movieData.posterPath,
        backdropPath: movieData.backdropPath,
        releaseDate: movieData.releaseDate,
        rating: movieData.rating,
        genres: movieData.genres?.map((genre) => genre.id) || []
      };

      const updatedHistory = [entry, ...filteredHistory].slice(0, 20);
      localStorage.setItem('watchedMovies', JSON.stringify(updatedHistory));
    } catch (storageError) {
      console.error('Error updating watch history:', storageError);
    }
  }, []);

  const fetchMovieDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
      updateWatchHistory(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details');
      setLoading(false);
    }
  }, [id, updateWatchHistory]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-500">{error || 'Movie not found'}</p>
          <button
            onClick={() => navigate('/movies')}
            className="mt-4 btn-primary"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const vidkingUrl = movie.id 
    ? `https://www.vidking.net/embed/movie/${movie.id}?color=9146ff&autoPlay=true`
    : null;

  return (
    <div className="min-h-screen bg-dark-main">
      {/* Back Button */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/movies')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Movies</span>
        </button>
      </div>

      {/* Video Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-xl">
          {vidkingUrl ? (
            <iframe
              src={vidkingUrl}
              className="w-full h-full"
              width="100%"
              height="600"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
              title={movie.title}
            />
          ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-xl mb-2">Player not available</p>
                    <p className="text-sm">Movie ID not found</p>
                  </div>
                </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  className="w-64 rounded-2xl shadow-xl"
                />
              ) : (
                <div className="w-64 h-96 bg-dark-card rounded-2xl flex items-center justify-center">
                  <span className="text-gray-700">No poster</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-lg text-gray-400 italic mb-4">{movie.tagline}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
                {movie.releaseDate && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span>{movie.rating?.toFixed(1)} / 10</span>
                </div>
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-dark-card rounded-full text-sm text-gray-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>

              {/* Cast */}
              {movie.cast?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Cast</h2>
                  <div className="flex flex-wrap gap-3">
                    {movie.cast.slice(0, 6).map((actor) => (
                      <div
                        key={actor.id}
                        className="text-sm"
                      >
                        <p className="text-white font-medium">{actor.name}</p>
                        <p className="text-gray-400">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePlayer;
