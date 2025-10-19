const axios = require('axios');
const Stream = require('../models/Stream');

const STREAMED_BASE_URL = 'https://streamed.pk/api';

const isMongoConfigured = () => Boolean(process.env.MONGODB_URI);

const requireMongo = () => {
  if (!isMongoConfigured()) {
    const error = new Error('Streaming feature is not configured. Please set up MongoDB to enable streams.');
    error.statusCode = 503;
    throw error;
  }
};

const fetchSports = async () => {
  const response = await axios.get(`${STREAMED_BASE_URL}/sports`);
  return response.data;
};

const fetchMatches = async (sport) => {
  const response = await axios.get(`${STREAMED_BASE_URL}/matches/${sport}`);
  return response.data;
};

const fetchStreamDetails = async (source, id) => {
  const response = await axios.get(`${STREAMED_BASE_URL}/stream/${source}/${id}`);
  return response.data;
};

const fetchExternalStreams = async () => {
  const matchesResponse = await axios.get(`${STREAMED_BASE_URL}/matches/football`);
  const matches = matchesResponse.data;

  const streamsWithThumbnails = await Promise.all(
    matches.map(async (match) => {
      const firstSource = match.sources && match.sources[0];
      let streamData = null;
      let thumbnail = match.poster || null;

      if (firstSource) {
        try {
          streamData = await fetchStreamDetails(firstSource.source, firstSource.id);
        } catch (error) {
          console.error('Error fetching stream for match:', {
            matchId: match.id,
            error: error?.response?.data || error?.message || error,
          });
          streamData = null;
        }
      }

      return {
        matchId: match.id,
        title: match.title,
        stream: streamData,
        thumbnail,
      };
    })
  );

  return streamsWithThumbnails;
};

const getActiveStreams = async () => {
  requireMongo();
  return Stream.find({ status: 'active' }).sort({ createdAt: -1 });
};

const getStreamById = async (id) => {
  requireMongo();
  const stream = await Stream.findById(id);
  if (!stream) {
    const error = new Error('Stream not found');
    error.statusCode = 404;
    throw error;
  }
  return stream;
};

const createStream = async ({ title, description }) => {
  requireMongo();

  if (!title || !description) {
    const error = new Error('Title and description are required');
    error.statusCode = 400;
    throw error;
  }

  const stream = new Stream({
    title,
    description,
    status: 'active',
    thumbnail: '',
  });

  await stream.save();
  return stream;
};

const updateStreamStatus = async (id, status) => {
  requireMongo();

  if (!['active', 'inactive', 'ended'].includes(status)) {
    const error = new Error('Invalid status');
    error.statusCode = 400;
    throw error;
  }

  const stream = await Stream.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!stream) {
    const error = new Error('Stream not found');
    error.statusCode = 404;
    throw error;
  }

  return stream;
};

const deleteStream = async (id) => {
  requireMongo();

  const stream = await Stream.findById(id);
  if (!stream) {
    const error = new Error('Stream not found');
    error.statusCode = 404;
    throw error;
  }

  await Stream.findByIdAndDelete(id);
  return { message: 'Stream deleted successfully' };
};

const updateViewerCount = async (id, action) => {
  requireMongo();

  const update = action === 'increment' ? { $inc: { viewers: 1 } } : { $inc: { viewers: -1 } };
  const stream = await Stream.findByIdAndUpdate(id, update, { new: true });

  if (!stream) {
    const error = new Error('Stream not found');
    error.statusCode = 404;
    throw error;
  }

  return { viewers: stream.viewers };
};

module.exports = {
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
};
