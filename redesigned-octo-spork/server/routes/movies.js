const express = require('express');
const {
  searchMovies,
  getPopularMovies,
  getMovieDetails,
  getMovieGenres,
} = require('../services/moviesService');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const result = await searchMovies(query, page);
    res.json(result);
  } catch (error) {
    console.error('Error searching movies:', error.response?.data || error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to search movies' });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const result = await getPopularMovies(page);
    res.json(result);
  } catch (error) {
    console.error('Error fetching popular movies:', error.response?.data || error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch popular movies' });
  }
});

router.get('/genres/list', async (req, res) => {
  try {
    const genres = await getMovieGenres();
    res.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error.response?.data || error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch genres' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await getMovieDetails(req.params.id);
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error.response?.data || error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch movie details' });
  }
});

module.exports = router;
