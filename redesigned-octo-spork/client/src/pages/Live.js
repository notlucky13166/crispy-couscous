import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  VideoCameraIcon, 
  PlayIcon,
  SignalIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Live = () => {
  const [matches, setMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('football');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSports();
  }, []);


  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/streams/matches/${selectedSport}`);
      setMatches(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load live matches');
      setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    if (selectedSport) {
      fetchMatches();
    }
  }, [selectedSport, fetchMatches]);

  const fetchSports = async () => {
    try {
      const response = await axios.get('/api/streams/sports');
      setSports(response.data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-dark-main flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading live matches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Live Sports</h1>
          <p className="text-gray-400">Watch live sports matches from around the world</p>
        </div>

        {sports.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {sports.map((sport) => {
              const sportId = typeof sport === 'string' ? sport : sport.id;
              const sportName = typeof sport === 'string' ? sport : sport.name;
              return (
                <button
                  key={sportId}
                  onClick={() => setSelectedSport(sportId)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize font-semibold ${
                    selectedSport === sportId
                      ? 'bg-primary-700 text-white'
                      : 'bg-dark-card text-gray-300 hover:bg-dark-main'
                  }`}
                >
                  {sportName}
                </button>
              );
            })}
          </div>
        )}

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <TrophyIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No live matches</h3>
            <p className="text-gray-500">Check back later for live {selectedSport} matches!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const firstSource = match.sources && match.sources[0];
              const matchId = firstSource ? `${firstSource.source}-${firstSource.id}` : match.id;
              const posterUrl = match.poster
                ? `https://streamed.pk/api/images/proxy/${match.poster.split('/').pop().replace(/\.[a-zA-Z]+$/, '')}.webp`
                : null;
              return (
                <div
                  key={matchId}
                  className="bg-dark-card rounded-2xl p-6 card-hover cursor-pointer group shadow-xl"
                >
                  <div className="relative mb-4">
                    <div className="aspect-video bg-dark-main rounded-lg flex items-center justify-center overflow-hidden">
                      {posterUrl ? (
                        <img 
                          src={posterUrl} 
                          alt={match.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={e => { e.target.onerror = null; e.target.src = '/fallback-poster.webp'; }}
                        />
                      ) : (
                        <VideoCameraIcon className="w-12 h-12 text-gray-700" />
                      )}
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold live-indicator flex items-center">
                        <SignalIcon className="w-3 h-3 mr-1" />
                        LIVE
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary-700 rounded-full p-3">
                        <PlayIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <Link to={`/stream/${matchId}`} state={{ match }}>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {match.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="capitalize">{match.category || selectedSport}</span>
                    {match.time && <span>{match.time}</span>}
                  </div>
                  {firstSource && (
                    <div className="text-xs text-gray-500">
                      {match.sources.length} stream{match.sources.length !== 1 ? 's' : ''} available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;
