const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  streamiId: {
    type: String,
    required: true,
    unique: true
  },
  hlsUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'ended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewers: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: ''
  }
});

streamSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Stream', streamSchema);