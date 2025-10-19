# Lukie's Streams - Replit Project

## Overview
Lukie's Streams is a full-stack movie and live streaming web application. The app allows users to browse movies via the TMDB API, watch live streams, and includes an admin panel for stream management. All pages are now public - no authentication required.

**Current Status:** ✅ **Fully functional!** Both Movies and Live Sports features working perfectly. Movies feature configured with TMDB API and vidking.net player. Live sports integrated with streamed.pk API.

## Recent Changes (October 18, 2025) - Movie Player Update
- ✅ **Updated movie player to vidking.net** - New streaming provider integration
  - Changed from vidsrc.xyz to vidking.net API
  - Using TMDB ID directly: `https://www.vidking.net/embed/movie/{tmdbId}`
  - Added custom purple branding (color=9146ff) and autoplay
  - Player loads content from multiple server sources (Oxygen, etc.)
  - Supports watch progress tracking via postMessage events
- ✅ **Enhanced live stream viewer** - Improved iframe attributes
  - Confirmed no sandbox attributes for better compatibility
  - Added explicit width/height attributes
  - Enhanced allow permissions for fullscreen support

## Previous Changes (October 18, 2025) - Fresh GitHub Import
- ✅ **Fresh GitHub import setup complete** - Project successfully configured for Replit
  - Moved project from nested directory structure to root
  - Installed Node.js 20 (already available)
  - Installed all server and client dependencies
  - Added comprehensive .gitignore for Node.js projects
- ✅ **Configured React dev server with react-app-rewired** - Proper Replit proxy support
  - Installed and configured react-app-rewired to use config-overrides.js
  - Frontend runs on 0.0.0.0:5000 with allowedHosts: 'all'
  - Backend runs on localhost:3001
  - API proxy properly configured via client package.json and config-overrides.js
- ✅ **Set up Development Server workflow** - Both servers running smoothly
  - Workflow executes start.sh script
  - Backend starts first on localhost:3001
  - Frontend starts on 0.0.0.0:5000 after backend is ready
  - Proper process management and cleanup on shutdown
- ✅ **Configured TMDB API key** - Movies feature fully operational
  - TMDB_API_KEY added via Replit Secrets
  - Movies page loading and displaying popular movies with posters
  - Search functionality working
- ✅ **Verified Live Sports functionality** - streamed.pk API integration working
  - Live sports page showing football matches from around the world
  - Multiple sport categories available (Football, Basketball, Hockey, etc.)
  - Stream availability indicators working
- ✅ **Configured deployment** - Ready to publish
  - Build command: installs dependencies and builds React client
  - Run command: node server/index.js (serves production build)
  - Autoscale deployment target configured

## Previous Changes (October 18, 2025) - Earlier Session
- ✅ **Fixed Movies page** - TMDB API integration working
  - Configured TMDB_API_KEY via Replit Secrets (secure storage)
  - Movies now loading from TMDB API with real data
  - Popular movies displaying with posters and details
  - Search functionality operational
- ✅ **Fixed Live Sports page** - streamed.pk API integration complete
  - Added backend proxy routes for streamed.pk API to avoid CORS issues
  - Proxy routes: `/api/streams/sports`, `/api/streams/matches/:sport`, `/api/streams/stream/:source/:id`
  - Updated Live.js and StreamViewer.js to use backend proxy
  - Sport category filters working (Football, Basketball, Hockey, etc.)
  - Live match cards displaying with team info and stream availability
- ✅ **Fixed API proxy configuration** - Resolved 404 errors
  - Removed setupProxy.js (was causing path issues)
  - Added simple `"proxy": "http://localhost:3001"` to client package.json
  - All /api requests now properly forwarded to backend
- ✅ **Verified both features** - End-to-end testing complete
  - Movies page: ✅ Loading popular movies from TMDB
  - Live page: ✅ Showing live sports matches from streamed.pk
  - No console errors, clean functionality

## Previous Changes (October 18, 2025) - Initial Setup
- ✅ **Re-imported and configured for Replit** - Fresh setup from GitHub
  - Installed Node.js 20 and all dependencies
  - Fixed react-router-dom compatibility (downgraded to v6)
  - Added missing axios dependency for server
  - Updated .gitignore for Node.js project
- ✅ **Fixed React dev server configuration** - Proper Replit proxy support
  - Configured frontend to run on 0.0.0.0:5000 with DANGEROUSLY_DISABLE_HOST_CHECK
  - Backend runs on localhost:3001
  - API proxy properly configured via package.json
- ✅ **Improved start.sh script** - Better process management
  - Added proper error handling and cleanup
  - Both frontend and backend start reliably
  - Process monitoring to ensure backend starts successfully
- ✅ **Configured deployment** - Ready to publish
  - Build command: builds React client
  - Run command: serves production build via Express
  - Autoscale deployment target configured

## Previous Changes (October 6, 2025)
- ✅ **Removed all authentication** - Made app completely public
  - Deleted Login and Register pages
  - Removed AuthContext and all auth dependencies
  - Cleaned up Navbar to remove login/register buttons
  - Updated Admin page to work without authentication
  - Removed server auth routes, middleware, and User model
- ✅ **Fixed rate limiter configuration** - Added `trust proxy` setting for Replit environment
- ✅ **Made MongoDB optional** - App now runs without crashing when MongoDB isn't configured
  - Streams feature gracefully handles missing database
  - Clear error messages returned when streams are unavailable
- ✅ **Configured TMDB API** - Movies feature fully operational with real movie data
- ✅ **Installed all dependencies** - Both client and server packages installed
- ✅ **Verified functionality** - Application tested and working correctly

## Previous Changes (October 5, 2025)
- ✅ Configured React dev server to run on port 5000 with proper host settings for Replit proxy
- ✅ Updated backend server to run on port 3001 (localhost)
- ✅ Fixed missing FilmIcon import in Movies.js component
- ✅ Added path module import to server/index.js for production mode
- ✅ Created startup script (start.sh) to run both frontend and backend concurrently
- ✅ Configured deployment settings for autoscale deployment
- ✅ Set up workflow "Development Server" running on port 5000
- ✅ **NEW: Integrated vidsrc.dev API for movie playback**
  - Added MoviePlayer component with vidsrc.dev iframe embed
  - Backend now fetches IMDb IDs from TMDB API (external_ids)
  - Movies page links to player at /movie/:id route
  - Player displays movie details and embedded vidsrc.dev stream

## Project Architecture

### Tech Stack
**Frontend:**
- React 18 with React Router DOM
- Tailwind CSS for styling
- Heroicons for icons
- HLS.js for video streaming
- Axios for API calls

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ORM (optional)
- Helmet & CORS for security
- Rate limiting middleware with trust proxy enabled

**External APIs:**
- TMDB API (The Movie Database) - for movie data and metadata
- vidking.net - for movie streaming/playback with multiple server sources
- streamed.pk API - for live sports streaming functionality

### Project Structure
```
lukies-streams/
├── client/                 # React frontend (runs on port 5000)
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components (Navbar)
│   │   ├── pages/         # Page components (Home, Movies, Live, Admin, etc.)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend (runs on port 3001)
│   ├── models/           # MongoDB schemas (Stream)
│   ├── routes/           # API routes (movies, streams)
│   └── index.js          # Server entry point
├── start.sh              # Startup script for both servers
├── package.json          # Server dependencies
└── .env                  # Environment variables (not in git)
```

### Port Configuration
- **Frontend (React):** Port 5000 (0.0.0.0) - User-facing webview
- **Backend (Express):** Port 3001 (localhost) - Internal API server
- **Proxy:** Frontend proxies API requests to localhost:3001

### Environment Variables
The following environment variables are available (managed via Replit Secrets):

**Required:**
- `TMDB_API_KEY` - API key for The Movie Database (required for movies feature)

**Optional:**
- `MONGODB_URI` - MongoDB connection string (required only for streams feature)
- `STREAMI_API_KEY` - API key for Streami platform (required only for streams feature)
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## API Endpoints

### Movies
- `GET /api/movies/popular` - Get popular movies from TMDB
- `GET /api/movies/search?query={query}` - Search movies
- `GET /api/movies/:id` - Get movie details by ID

### Streams
*Note: All stream endpoints require MongoDB to be configured. They return a 503 error with a clear message when MongoDB is not available.*

- `GET /api/streams` - Get all active streams
- `GET /api/streams/:id` - Get stream by ID
- `POST /api/streams` - Create new stream
- `PATCH /api/streams/:id/status` - Update stream status
- `DELETE /api/streams/:id` - Delete stream
- `POST /api/streams/:id/viewers` - Update viewer count

## Deployment
The project is configured for Replit autoscale deployment:
- **Build command:** `npm run build` - Builds the React frontend
- **Run command:** `node server/index.js` - Starts the production server
- Production mode serves the built React app from the Express server

## Development Notes

### Running Locally in Replit
The "Development Server" workflow automatically:
1. Starts the backend server on localhost:3001
2. Starts the React dev server on 0.0.0.0:5000
3. Both servers run concurrently via start.sh script

### Known Issues & Warnings
- React Router future flag warnings - non-critical, informational only
- React Hook dependency warnings in MoviePlayer.js and StreamViewer.js - non-critical
- **Streams feature requires MongoDB** - Set MONGODB_URI environment variable to enable
- **Live streaming requires Streami API** - Set STREAMI_API_KEY environment variable to enable stream creation

### Database Setup (Optional)
The streams feature requires MongoDB. If you want to enable streams:
1. Create a MongoDB database (MongoDB Atlas recommended for cloud hosting)
2. Add the connection string as MONGODB_URI in Replit Secrets
3. Restart the application

Without MongoDB, the movies feature will work perfectly, and stream endpoints will return helpful error messages.

## User Preferences
*No specific user preferences recorded yet*

## Future Enhancements
- Set up MongoDB cloud instance to enable streams feature
- Configure Streami API key for live stream creation
- Add user accounts and personalization (currently removed for public access)
- Implement real-time viewer count updates via WebSockets
- Add video upload functionality
- Improve error handling for edge cases
