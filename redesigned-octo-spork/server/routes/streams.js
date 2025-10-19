const express = require('express');
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
} = require('../services/streamsService');

const router = express.Router();

router.get('/sports', async (req, res) => {
  try {
    const data = await fetchSports();
    res.json(data);
  } catch (error) {
    console.error('Error fetching sports:', error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch sports' });
  }
});

router.get('/matches/:sport', async (req, res) => {
  try {
    const data = await fetchMatches(req.params.sport);
    res.json(data);
  } catch (error) {
    console.error('Error fetching matches:', error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch matches' });
  }
});

router.get('/stream/:source/:id', async (req, res) => {
  try {
    const data = await fetchStreamDetails(req.params.source, req.params.id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching stream details:', error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch stream details' });
  }
});

router.get('/external', async (req, res) => {
  try {
    const data = await fetchExternalStreams();
    res.json(data);
  } catch (error) {
    console.error('Error fetching external streams:', error?.response?.data || error?.message || error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch external streams' });
  }
});

router.get('/', async (req, res) => {
  if (!isMongoConfigured()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }

  try {
    const streams = await getActiveStreams();
    res.json(streams);
  } catch (error) {
    console.error('Error fetching streams:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch streams' });
  }
});

router.get('/:id', async (req, res) => {
  if (!isMongoConfigured()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }

  try {
    const stream = await getStreamById(req.params.id);
    res.json(stream);
  } catch (error) {
    console.error('Error fetching stream:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch stream' });
  }
});

router.post('/', async (req, res) => {
  if (!isMongoConfigured()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }

  try {
    const stream = await createStream(req.body);
    res.status(201).json(stream);
  } catch (error) {
    console.error('Error creating stream:', error.response?.data || error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create stream' });
  }
});

router.patch('/:id/status', async (req, res) => {
  if (!isMongoConfigured()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }

  try {
    const stream = await updateStreamStatus(req.params.id, req.body.status);
    res.json(stream);
  } catch (error) {
    console.error('Error updating stream status:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to update stream status' });
  }
});

router.delete('/:id', async (req, res) => {
  if (!isMongoConfigured()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }

  try {
    const result = await deleteStream(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting stream:', error.response?.data || error.message);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to delete stream' });
  }
});

router.post('/:id/viewers', async (req, res) => {
  if (!isMongoConfigured()) {
    return res.status(503).json({ error: 'Streaming feature is not configured. Please set up MongoDB to enable streams.' });
  }

  try {
    const result = await updateViewerCount(req.params.id, req.body.action);
    res.json(result);
  } catch (error) {
    console.error('Error updating viewer count:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to update viewer count' });
  }
});

module.exports = router;
