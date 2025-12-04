interface FootballAIProps {
  player: any;
  team: any;
  isLoading: boolean;
  analysis?: string;
  teams?: any[];
  worldCupInfo?: any;
}

export default function FootballAI({ 
  player, 
  team, 
  isLoading,
  analysis,
  teams,
  worldCupInfo 
}: FootballAIProps) {
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(74, 222, 128, 0.3)',
          borderTopColor: '#4ade80',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
          Analyzing football data with AI...
        </p>
      </div>
    );
  }

  if (player || team) {
    return (
      <div>
        {/* Player or Team Header */}
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>
          {player ? player.name : team?.name}
        </h2>
        
        {/* AI Analysis Section */}
        {analysis && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
              <h3 style={{ color: 'white', fontWeight: 600 }}>AI Analysis</h3>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
              {analysis}
            </p>
          </div>
        )}
        
        {/* Player/Team Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {player && (
            <>
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Position</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{player.position}</div>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Nationality</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{player.nationality}</div>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Club</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{player.club}</div>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Market Value</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{player.marketValue || 'N/A'}</div>
              </div>
            </>
          )}
          
          {team && (
            <>
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Ranking</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{team.ranking}</div>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
              }}>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Coach</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{team.coach}</div>
              </div>
            </>
          )}
        </div>
        
        {/* Player Stats Section */}
        {player && (
          <div style={{
            background: 'linear-gradient(to right, rgba(74, 222, 128, 0.1), rgba(34, 211, 238, 0.1))',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginTop: '1rem',
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>Career Stats</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4ade80' }}>{player.goals || 0}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Goals</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22d3ee' }}>{player.assists || 0}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Assists</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24' }}>{player.appearances || 0}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Apps</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Achievements Section */}
        {player?.achievements && player.achievements.length > 0 && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginTop: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🏆</span>
              <h3 style={{ color: 'white', fontWeight: 600 }}>Achievements</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {player.achievements.map((achievement: string, index: number) => (
                <span 
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    color: '#fbbf24',
                  }}
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* World Cup Info */}
        {worldCupInfo && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginTop: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🌍</span>
              <h3 style={{ color: 'white', fontWeight: 600 }}>World Cup {worldCupInfo.year}</h3>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              <strong>Host:</strong> {worldCupInfo.host}
            </p>
            {worldCupInfo.details && (
              <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                {worldCupInfo.details}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default state - no search yet
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1.5rem',
        opacity: 0.7,
      }}>
        ⚽
      </div>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: 'white',
      }}>
        FutbolAI Analysis
      </h3>
      <p style={{
        color: '#94a3b8',
        maxWidth: '400px',
        lineHeight: 1.6,
      }}>
        Search for a player or team above to get AI-powered football analysis,
        stats, and insights. Powered by Groq AI.
      </p>
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <span style={{
          padding: '0.5rem 1rem',
          background: 'rgba(74, 222, 128, 0.1)',
          borderRadius: '999px',
          fontSize: '0.875rem',
          color: '#4ade80',
        }}>
          World Cup 2026
        </span>
        <span style={{
          padding: '0.5rem 1rem',
          background: 'rgba(34, 211, 238, 0.1)',
          borderRadius: '999px',
          fontSize: '0.875rem',
          color: '#22d3ee',
        }}>
          Player Stats
        </span>
        <span style={{
          padding: '0.5rem 1rem',
          background: 'rgba(251, 191, 36, 0.1)',
          borderRadius: '999px',
          fontSize: '0.875rem',
          color: '#fbbf24',
        }}>
          Team Analysis
        </span>
      </div>
    </div>
  );
}

// Add CSS for spinner animation
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleTag);