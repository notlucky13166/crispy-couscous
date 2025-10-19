const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const mapMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  posterPath: movie.poster_path,
  backdropPath: movie.backdrop_path,
  releaseDate: movie.release_date,
  rating: movie.vote_average,
  voteCount: movie.vote_count,
  genreIds: movie.genre_ids,
});

const searchMovies = async (query, page = 1) => {
  if (!query) {
    const error = new Error('Query parameter is required');
    error.statusCode = 400;
    throw error;
  }

  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query,
      page,
      include_adult: false,
    },
  });

  return {
    movies: response.data.results.map(mapMovie),
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
    page: response.data.page,
  };
};

const getPopularMovies = async (page = 1) => {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
    params: {
      api_key: TMDB_API_KEY,
      page,
    },
  });

  return {
    movies: response.data.results.map(mapMovie),
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
    page: response.data.page,
  };
};

const getMovieDetails = async (id) => {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
    params: {
      api_key: TMDB_API_KEY,
      append_to_response: 'credits,videos,similar,external_ids',
    },
  });

  const data = response.data;

  return {
    id: data.id,
    imdbId: data.external_ids?.imdb_id || null,
    title: data.title,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    releaseDate: data.release_date,
    rating: data.vote_average,
    voteCount: data.vote_count,
    runtime: data.runtime,
    genres: data.genres,
    budget: data.budget,
    revenue: data.revenue,
    tagline: data.tagline,
    cast: data.credits?.cast?.slice(0, 10) || [],
    crew: data.credits?.crew?.slice(0, 5) || [],
    videos: data.videos?.results || [],
    similar: data.similar?.results?.slice(0, 6) || [],
  };
};

const getMovieGenres = async () => {
  const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  return response.data.genres;
};

module.exports = {
  searchMovies,
  getPopularMovies,
  getMovieDetails,
  getMovieGenres,
};
