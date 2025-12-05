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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onLoadingChange(true);
    
    try {
      // Call your REAL API endpoint
      const response = await fetch(`/api/ai?action=search&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        // CLEAR previous selections first
        onPlayerSelect(null);
        onTeamSelect(null);
        onWorldCupUpdate(null);
        onTeamsUpdate([]);
        
        // Check response TYPE to know what to display
        console.log('API Response type:', data.type);
        console.log('Player info:', data.playerInfo);
        console.log('Team info:', data.teamInfo);
        
        if (data.type === 'player' && data.playerInfo) {
          console.log('Setting player data');
          onPlayerSelect({
            id: Date.now(),
            name: data.playerInfo.name,
            position: data.playerInfo.position,
            nationality: data.playerInfo.nationality,
            club: data.playerInfo.currentClub,
            age: null,
            goals: data.playerInfo.stats?.goals || 0,
            assists: data.playerInfo.stats?.assists || 0,
            appearances: data.playerInfo.stats?.appearances || 0,
            rating: data.confidence * 10,
            marketValue: data.playerInfo.marketValue,
            achievements: data.playerInfo.achievements || [],
          });
        } 
        else if (data.type === 'team' && data.teamInfo) {
          console.log('Setting team data');
          onTeamSelect({
            id: Date.now(),
            name: data.teamInfo.name,
            ranking: data.teamInfo.ranking || 'N/A',
            coach: data.teamInfo.coach || 'Unknown',
            stadium: data.teamInfo.stadium || 'Unknown',
            league: data.teamInfo.league || 'Unknown',
            founded: data.teamInfo.founded || 'Unknown',
            achievements: data.teamInfo.achievements || [],
            keyPlayers: data.teamInfo.keyPlayers || [],
          });
        }
        else if (data.type === 'worldCup' && data.worldCupInfo) {
          console.log('Setting World Cup data');
          onWorldCupUpdate({
            year: data.worldCupInfo.year,
            host: data.worldCupInfo.host,
            details: data.worldCupInfo.details,
            qualifiedTeams: data.worldCupInfo.qualifiedTeams || [],
            venues: data.worldCupInfo.venues || [],
          });
        }
        else {
          console.log('General query - no specific data');
          // For general queries, just show analysis
        }
        
        // Update analysis (always available)
        onAnalysisUpdate(data.analysis || `Analysis for ${query}`);
        
        // Update video
        onVideoFound(data.youtubeUrl);
        
      } else {
        // Handle API error
        console.error('API Error:', data.error);
        fallbackToMockData();
      }
    } catch (error) {
      console.error('Search failed:', error);
      fallbackToMockData();
    }
    
    onLoadingChange(false);
  };

  const fallbackToMockData = () => {
    // Clear previous
    onPlayerSelect(null);
    onTeamSelect(null);
    onWorldCupUpdate(null);
    
    // Fallback mock data - TEAM example
    const mockTeam = {
      id: 1,
      name: 'Real Madrid',
      ranking: '1st in La Liga',
      coach: 'Carlo Ancelotti',
      stadium: 'Santiago Bernabéu',
      league: 'La Liga',
      founded: 1902,
      achievements: ['14 Champions League titles', '35 La Liga titles'],
      keyPlayers: ['Vinicius Junior', 'Jude Bellingham', 'Thibaut Courtois'],
    };
    
    onTeamSelect(mockTeam);
    onVideoFound('https://www.youtube.com/embed/XfyZ6EueJx8');
    onAnalysisUpdate('Football analysis service is temporarily unavailable. Showing sample team data for Real Madrid.');
  };

  const quickSearches = [
    'Messi', 
    'World Cup 2026', 
    'Argentina', 
    'Brazil', 
    'Mbappé', 
    'Real Madrid', 
    'Champions League',
    'Manchester City',
    'Karim Benzema'
  ];

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>
        ⚽ Football AI Search
      </h2>
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, teams, World Cup 2026..."
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.75rem',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
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
            transition: 'transform 0.2s, opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.opacity = '1';
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
              // Auto-search when clicking quick search
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
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(74, 222, 128, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}