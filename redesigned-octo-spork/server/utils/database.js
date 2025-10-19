const mongoose = require('mongoose');

let databaseConnectionPromise = null;

const ensureDatabaseConnection = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('MongoDB not configured - streams feature will not be available');
    return;
  }

  if (!databaseConnectionPromise) {
    databaseConnectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('MongoDB connected');
      })
      .catch((err) => {
        databaseConnectionPromise = null;
        console.error('MongoDB connection error:', err);
      });
  }

  return databaseConnectionPromise;
};

module.exports = {
  ensureDatabaseConnection,
};
