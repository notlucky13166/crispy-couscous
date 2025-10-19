const buildResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

exports.handler = async () => {
  return buildResponse(200, { status: 'OK', timestamp: new Date().toISOString() });
};
