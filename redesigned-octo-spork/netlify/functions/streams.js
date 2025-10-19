const {
  isMongoConfigured,
  fetchSports,
  fetchMatches,
  fetchStreamDetails,
  fetchExternalStreams,
  getActiveStreams,
  getStreamById,
  createStream,
  updateStreamStatus,
  deleteStream,
  updateViewerCount,
} = require('../../server/services/streamsService');
const { ensureDatabaseConnection } = require('../../server/utils/database');

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
    .replace(/^\/\.netlify\/functions\/streams/, '')
    .replace(/^\/api\/streams/, '')
    .replace(/^\//, '');
};

const parseBody = (event) => {
  if (!event.body) {
    return {};
  }

  const decoded = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  try {
    return JSON.parse(decoded);
  } catch (error) {
    return {};
  }
};

const ensureMongo = async () => {
  if (!isMongoConfigured()) {
    const error = new Error('Streaming feature is not configured. Please set up MongoDB to enable streams.');
    error.statusCode = 503;
    throw error;
  }

  await ensureDatabaseConnection();
};

exports.handler = async (event) => {
  try {
    const route = extractRoute(event.path);
    const segments = route.split('/').filter(Boolean);

    if (event.httpMethod === 'GET' && segments.length === 0) {
      await ensureMongo();
      const streams = await getActiveStreams();
      return buildResponse(200, streams);
    }

    if (event.httpMethod === 'GET' && segments[0] === 'sports') {
      const data = await fetchSports();
      return buildResponse(200, data);
    }

    if (event.httpMethod === 'GET' && segments[0] === 'matches' && segments[1]) {
      const data = await fetchMatches(segments[1]);
      return buildResponse(200, data);
    }

    if (event.httpMethod === 'GET' && segments[0] === 'stream' && segments[1] && segments[2]) {
      const data = await fetchStreamDetails(segments[1], segments[2]);
      return buildResponse(200, data);
    }

    if (event.httpMethod === 'GET' && segments[0] === 'external') {
      const data = await fetchExternalStreams();
      return buildResponse(200, data);
    }

    if (segments.length === 1 && /^[^/]+$/.test(segments[0])) {
      if (event.httpMethod === 'GET') {
        await ensureMongo();
        const stream = await getStreamById(segments[0]);
        return buildResponse(200, stream);
      }

      if (event.httpMethod === 'DELETE') {
        await ensureMongo();
        const result = await deleteStream(segments[0]);
        return buildResponse(200, result);
      }
    }

    if (segments.length === 2 && segments[1] === 'status' && event.httpMethod === 'PATCH') {
      await ensureMongo();
      const body = parseBody(event);
      const stream = await updateStreamStatus(segments[0], body.status);
      return buildResponse(200, stream);
    }

    if (segments.length === 2 && segments[1] === 'viewers' && event.httpMethod === 'POST') {
      await ensureMongo();
      const body = parseBody(event);
      const result = await updateViewerCount(segments[0], body.action);
      return buildResponse(200, result);
    }

    if (segments.length === 0 && event.httpMethod === 'POST') {
      await ensureMongo();
      const body = parseBody(event);
      const stream = await createStream(body);
      return buildResponse(201, stream);
    }

    return buildResponse(404, { error: 'Endpoint not found' });
  } catch (error) {
    console.error('Streams function error:', error.response?.data || error.message || error);
    const statusCode = error.statusCode || error.response?.status || 500;
    const message = error.message || 'Internal Server Error';
    return buildResponse(statusCode, { error: message });
  }
};
