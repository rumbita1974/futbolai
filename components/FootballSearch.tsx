'use client'

import { useState } from 'react';

interface FootballSearchProps {
  onPlayerSelect: (player: any) => void;
  onTeamSelect: (team: any) => void;
  onVideoFound: (url: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onAnalysisUpdate: (analysis: string) => void;
  onTeamsUpdate: (teams: any[]) => void;
  onWorldCupUpdate: (worldCupInfo: any) => void;
}

export default function FootballSearch({
  onPlayerSelect,
  onTeamSelect,
  onVideoFound,
  onLoadingChange,
  onAnalysisUpdate,
  onTeamsUpdate,
  onWorldCupUpdate,
}: FootballSearchProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    console.log('🔍 [SEARCH] Starting search for:', query);
    onLoadingChange(true);
    setError(null);
    
    // Clear previous selections
    onPlayerSelect(null);
    onTeamSelect(null);
    onWorldCupUpdate(null);
    onTeamsUpdate([]);
    onVideoFound('');
    onAnalysisUpdate('');
    
    try {
      const apiUrl = `/api/ai?action=search&query=${encodeURIComponent(query)}`;
      console.log('🔍 [API] Calling:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('🔍 [API] Response status:', response.status);
      
      const data = await response.json();
      console.log('🔍 [API] Response received, success:', data.success);
      
      if (data.success) {
        console.log('✅ [API] Success! Type:', data.type);
        
        const responseType = data.type || 'general';
        console.log('🎯 Processing as type:', responseType);
        
        if (responseType === 'player' && data.playerInfo) {
          console.log('👤 Setting player data:', data.playerInfo.name);
          
          onPlayerSelect({
            id: Date.now(),
            name: data.playerInfo.name || query,
            position: data.playerInfo.position || 'Unknown',
            nationality: data.playerInfo.nationality || 'Unknown',
            club: data.playerInfo.currentClub || data.playerInfo.club || 'Unknown',
            goals: data.playerInfo.stats?.goals || 0,
            assists: data.playerInfo.stats?.assists || 0,
            appearances: data.playerInfo.stats?.appearances || 0,
            marketValue: data.playerInfo.marketValue || 'Unknown',
            achievements: data.playerInfo.achievements || [],
          });
        } 
        else if (responseType === 'team' && data.teamInfo) {
          console.log('🏟️ Setting team data:', data.teamInfo.name);
          
          onTeamSelect({
            id: Date.now(),
            name: data.teamInfo.name,
            type: data.teamInfo.type || 'club',
            ranking: data.teamInfo.ranking || 'N/A',
            coach: data.teamInfo.coach || data.teamInfo.managerCoach || 'Unknown',
            stadium: data.teamInfo.stadium || 'Unknown',
            league: data.teamInfo.league || 'Unknown',
            founded: data.teamInfo.founded || 'Unknown',
            achievements: data.teamInfo.achievements || [],
            keyPlayers: data.teamInfo.keyPlayers || [],
          });
        }
        else if (responseType === 'worldCup' && data.worldCupInfo) {
          console.log('🌍 Setting World Cup data');
          
          onWorldCupUpdate({
            year: data.worldCupInfo.year,
            host: data.worldCupInfo.host,
            details: data.worldCupInfo.details,
            qualifiedTeams: data.worldCupInfo.qualifiedTeams || [],
          });
        }
        else {
          console.log('📝 General query - only showing analysis');
        }
        
        // Update analysis
        if (data.analysis) {
          console.log('💭 Setting analysis');
          onAnalysisUpdate(data.analysis);
        }
        
        // Update video
        if (data.youtubeUrl) {
          console.log('🎥 Setting video URL');
          onVideoFound(data.youtubeUrl);
        }
      } else {
        console.error('❌ API Error from response:', data.error);
        setError(data.error || 'Failed to fetch data');
        onAnalysisUpdate(`Error: ${data.error || 'Failed to fetch data'}`);
      }
    } catch (error) {
      console.error('❌ Search failed:', error);
      setError('Network error. Please check your connection.');
      onAnalysisUpdate('Network error. Please check your connection and try again.');
    } finally {
      onLoadingChange(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setError(null);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSearch(fakeEvent);
    }, 100);
  };

  const quickSearches = [
    'Messi', 
    'World Cup 2026', 
    'Argentina', 
    'Brazil', 
    'Real Madrid', 
    'Cristiano Ronaldo',
    'Spain',
    'Colombia'
  ];

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>
        ⚽ Football AI Search
      </h2>
      
      {error && (
        <div style={{
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          color: '#ef4444',
          fontSize: '0.875rem',
        }}>
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            fontSize: '1.25rem',
          }}>
            🔍
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError(null);
            }}
            placeholder="Search players, teams, World Cup 2026..."
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: error ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.75rem',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(to right, #4ade80, #22d3ee)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {quickSearches.map((term) => (
          <button
            key={term}
            onClick={() => {
              setQuery(term);
              setError(null);
              const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
              handleSearch(syntheticEvent);
            }}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '999px',
              color: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}