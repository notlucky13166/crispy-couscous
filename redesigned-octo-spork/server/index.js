const { createApp } = require('./app');
const { ensureDatabaseConnection } = require('./utils/database');

const startServer = async () => {
  await ensureDatabaseConnection();

  const app = createApp();
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = process.env.PORT || (isProduction ? 5000 : 3001);
  const HOST = process.env.HOST || (isProduction ? '0.0.0.0' : '127.0.0.1');

  app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
