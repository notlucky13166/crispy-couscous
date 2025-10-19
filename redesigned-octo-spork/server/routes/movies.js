const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        include_adult: false
      }
    });

    const movies = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      genreIds: movie.genre_ids
    }));

    res.json({
      movies,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      page: response.data.page
    });
  } catch (error) {
    console.error('Error searching movies:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Get popular movies
router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    const movies = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      genreIds: movie.genre_ids
    }));

    res.json({
      movies,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      page: response.data.page
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos,similar,external_ids'
      }
    });

    const movie = {
      id: response.data.id,
      imdbId: response.data.external_ids?.imdb_id || null,
      title: response.data.title,
      overview: response.data.overview,
      posterPath: response.data.poster_path,
      backdropPath: response.data.backdrop_path,
      releaseDate: response.data.release_date,
      rating: response.data.vote_average,
      voteCount: response.data.vote_count,
      runtime: response.data.runtime,
      genres: response.data.genres,
      budget: response.data.budget,
      revenue: response.data.revenue,
      tagline: response.data.tagline,
      cast: response.data.credits?.cast?.slice(0, 10) || [],
      crew: response.data.credits?.crew?.slice(0, 5) || [],
      videos: response.data.videos?.results || [],
      similar: response.data.similar?.results?.slice(0, 6) || []
    };

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Get movie genres
router.get('/genres/list', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    res.json(response.data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

module.exports = router;