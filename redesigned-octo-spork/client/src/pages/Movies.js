import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PlayIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FilmIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const DEFAULT_SORT = 'popularity.desc';

const sortOptions = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' }
];

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const fetchPopularMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/movies/popular');
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscoverMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/movies/discover', {
        params: {
          genre: selectedGenre || undefined,
          sortBy
        }
      });
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error discovering movies:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, sortBy]);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await axios.get('/api/movies/genres/list');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, []);

  const fetchSuggestions = useCallback(async (history) => {
    if (!history || history.length === 0) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const recentHistory = history.slice(0, 2);
      const responses = await Promise.all(
        recentHistory.map((movie) => axios.get(`/api/movies/${movie.id}/recommendations`))
      );

      const watchedIds = new Set(history.map((movie) => movie.id));
      const combined = [];

      responses.forEach((response) => {
        response.data.movies.forEach((movie) => {
          const alreadyWatched = watchedIds.has(movie.id);
          const alreadyAdded = combined.some((item) => item.id === movie.id);

          if (!alreadyWatched && !alreadyAdded) {
            combined.push(movie);
          }
        });
      });

      setSuggestions(combined.slice(0, 12));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const searchMovies = useCallback(async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      if (selectedGenre || sortBy !== DEFAULT_SORT) {
        await fetchDiscoverMovies();
      } else {
        await fetchPopularMovies();
      }
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/api/movies/search', {
        params: { query: trimmedQuery }
      });
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchDiscoverMovies, fetchPopularMovies, selectedGenre, sortBy]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      if (selectedGenre || sortBy !== DEFAULT_SORT) {
        fetchDiscoverMovies();
      } else {
        fetchPopularMovies();
      }
    }
  }, [selectedGenre, sortBy, searchQuery, fetchDiscoverMovies, fetchPopularMovies]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem('watchedMovies');
      const history = stored ? JSON.parse(stored) : [];
      setWatchedMovies(history);
      fetchSuggestions(history);
    } catch (error) {
      console.error('Error loading watch history:', error);
    }
  }, [fetchSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(searchQuery);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setSearchQuery('');
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setSearchQuery('');
  };

  const renderMovieCard = (movie) => (
    <div
      key={movie.id}
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="bg-dark-card rounded-2xl overflow-hidden card-hover cursor-pointer group shadow-xl"
    >
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
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
          <div className="bg-primary-700 rounded-full p-3">
            <PlayIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-600 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {movie.overview || 'No overview available.'}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—'}</span>
          <div className="flex items-center space-x-1">
            <StarIcon className="w-3 h-3 text-yellow-500" />
            <span>{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );

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

        {/* Search & Filters */}
        <div className="mb-8 bg-dark-card border border-gray-800 rounded-2xl p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <form onSubmit={handleSearch} className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full bg-dark-main border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:border-primary-700"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </form>
            <div className="flex flex-col sm:flex-row gap-6 md:w-auto">
              <div className="flex-1 min-w-[180px]">
                <label className="flex items-center text-sm font-medium text-gray-400 mb-2 gap-2">
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  className="w-full bg-dark-main border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-700"
                >
                  <option value="">All genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="flex items-center text-sm font-medium text-gray-400 mb-2 gap-2">
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full bg-dark-main border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-700"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {watchedMovies.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-semibold text-white">Suggested for you</h2>
            </div>
            {suggestionsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {suggestions.map((movie) => renderMovieCard(movie))}
              </div>
            ) : (
              <p className="text-gray-500">Watch a few more movies to see personalized recommendations.</p>
            )}
          </div>
        )}

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <FilmIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No movies found</h3>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => renderMovieCard(movie))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;