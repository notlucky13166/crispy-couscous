const {
  searchMovies,
  getPopularMovies,
  getMovieDetails,
  getMovieGenres,
} = require('../../server/services/moviesService');

const buildResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const extractRoute = (path) => {
  if (!path) {
    return '';
  }

  return path
    .replace(/^\/\.netlify\/functions\/movies/, '')
    .replace(/^\/api\/movies/, '')
    .replace(/^\//, '');
};

exports.handler = async (event) => {
  try {
    const route = extractRoute(event.path);
    const segments = route.split('/').filter(Boolean);

    if (event.httpMethod === 'GET' && segments.length === 0) {
      return buildResponse(404, { error: 'Endpoint not found' });
    }

    if (event.httpMethod === 'GET' && segments[0] === 'popular') {
      const page = event.queryStringParameters?.page || 1;
      const result = await getPopularMovies(page);
      return buildResponse(200, result);
    }

    if (event.httpMethod === 'GET' && segments[0] === 'search') {
      const { query, page = 1 } = event.queryStringParameters || {};
      const result = await searchMovies(query, page);
      return buildResponse(200, result);
    }

    if (event.httpMethod === 'GET' && segments[0] === 'genres' && segments[1] === 'list') {
      const genres = await getMovieGenres();
      return buildResponse(200, genres);
    }

    if (event.httpMethod === 'GET' && segments.length === 1) {
      const movie = await getMovieDetails(segments[0]);
      return buildResponse(200, movie);
    }

    return buildResponse(404, { error: 'Endpoint not found' });
  } catch (error) {
    console.error('Movies function error:', error.response?.data || error.message || error);
    const statusCode = error.statusCode || error.response?.status || 500;
    const message = error.message || 'Internal Server Error';
    return buildResponse(statusCode, { error: message });
  }
};
