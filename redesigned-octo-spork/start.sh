#!/bin/bash

# Function to handle cleanup
cleanup() {
  echo "Shutting down servers..."
  kill $(jobs -p) 2>/dev/null
  exit
}

trap cleanup SIGINT SIGTERM

# Start backend server on localhost:3001
echo "Starting backend server..."
node server/index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "Backend failed to start!"
  exit 1
fi

echo "Backend started on localhost:3001"

# Start frontend on 0.0.0.0:5000
echo "Starting frontend server..."
cd client && PORT=5000 HOST=0.0.0.0 DANGEROUSLY_DISABLE_HOST_CHECK=true WDS_SOCKET_PORT=0 npm start &
FRONTEND_PID=$!

# Wait for both processes
wait
