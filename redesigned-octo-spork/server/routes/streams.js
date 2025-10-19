const express = require('express');
const axios = require('axios');
const Stream = require('../models/Stream');
const router = express.Router();

const STREAMED_BASE_URL = 'https://streamed.pk/api';

// Proxy for streamed.pk sports API
router.get('/sports', async (req, res) => {
  try {
    const response = await axios.get(`${STREAMED_BASE_URL}/sports`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching sports:', error.message);
    res.status(500).json({ error: 'Failed to fetch sports' });
  }
});

// Proxy for streamed.pk matches API
router.get('/matches/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    const response = await axios.get(`${STREAMED_BASE_URL}/matches/${sport}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching matches:', error.message);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Proxy for streamed.pk stream details API
router.get('/stream/:source/:id', async (req, res) => {
  try {
    const { source, id } = req.params;
    const response = await axios.get(`${STREAMED_BASE_URL}/stream/${source}/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stream details:', error.message);
    res.status(500).json({ error: 'Failed to fetch stream details' });
  }
});

// Fetch streams and thumbnails from streamed.pk public API
router.get('/external', async (req, res) => {
  try {
    // Example: fetch all football matches
  const matchesResponse = await axios.get('https://streamed.pk/api/matches/football');
    const matches = matchesResponse.data;

    // For each match, get the first stream and its thumbnail (poster)
    const streamsWithThumbnails = await Promise.all(matches.map(async (match) => {
      const source = match.sources && match.sources[0];
      let streamData = null;
      let thumbnail = match.poster || null;

      if (source) {
        try {
          const streamResponse = await axios.get(`https://streamed.pk/api/stream/${source.source}/${source.id}`);
          streamData = streamResponse.data;
        } catch (err) {
          console.error('Error fetching stream for match:', {
            matchId: match.id,
            error: err?.response?.data || err?.message || err
          });
          streamData = null;
        }
      }

      return {
        matchId: match.id,
        title: match.title,
        stream: streamData,
        thumbnail
      };
    }));

    res.json(streamsWithThumbnails);
  } catch (error) {
    console.error('Error fetching external streams:', error?.response?.data || error?.message || error);
    res.status(500).json({ error: 'Failed to fetch external streams', details: error?.response?.data || error?.message || error });
  }
});


const checkMongoDBAvailable = () => {
  return process.env.MONGODB_URI !== undefined;
};

// Get all active streams
router.get('/', async (req, res) => {
  if (!checkMongoDBAvailable()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }
  
  try {
    const streams = await Stream.find({ status: 'active' })
      .sort({ createdAt: -1 });

    res.json(streams);
  } catch (error) {
    console.error('Error fetching streams:', error);
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

// Get stream by ID
router.get('/:id', async (req, res) => {
  if (!checkMongoDBAvailable()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }
  
  try {
    const stream = await Stream.findById(req.params.id);

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.json(stream);
  } catch (error) {
    console.error('Error fetching stream:', error);
    res.status(500).json({ error: 'Failed to fetch stream' });
  }
});

// Create new stream
router.post('/', async (req, res) => {
  if (!checkMongoDBAvailable()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }
  
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Example: Save stream to MongoDB without external API
    const stream = new Stream({
      title,
      description,
      status: 'active',
      thumbnail: ''
    });

    await stream.save();

    res.status(201).json(stream);
  } catch (error) {
    console.error('Error creating stream:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create stream' });
  }
});

// Update stream status
router.patch('/:id/status', async (req, res) => {
  if (!checkMongoDBAvailable()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }
  
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'ended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.json(stream);
  } catch (error) {
    console.error('Error updating stream status:', error);
    res.status(500).json({ error: 'Failed to update stream status' });
  }
});

// Delete stream
router.delete('/:id', async (req, res) => {
  if (!checkMongoDBAvailable()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }
  
  try {
    const stream = await Stream.findById(req.params.id);

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }


    // Delete from MongoDB only
    await Stream.findByIdAndDelete(req.params.id);

    res.json({ message: 'Stream deleted successfully' });
  } catch (error) {
    console.error('Error deleting stream:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to delete stream' });
  }
});

// Update viewer count
router.post('/:id/viewers', async (req, res) => {
  if (!checkMongoDBAvailable()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }
  
  try {
    const { action } = req.body;

    const update = action === 'increment' 
      ? { $inc: { viewers: 1 } }
      : { $inc: { viewers: -1 } };

    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.json({ viewers: stream.viewers });
  } catch (error) {
    console.error('Error updating viewer count:', error);
    res.status(500).json({ error: 'Failed to update viewer count' });
  }
});

module.exports = router;