import { useState } from 'react';
import FootballSearch from '../components/FootballSearch';
import FootballAI from '../components/FootballAI';

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [teams, setTeams] = useState<any[]>([]);
  const [worldCupInfo, setWorldCupInfo] = useState<any>(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a2e1a 0%, #1a5c36 100%)',
      color: 'white',
      padding: '2rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: 800,
      marginBottom: '1rem',
      background: 'linear-gradient(to right, #4ade80, #ec4899, #f59e0b)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    subtitle: {
      color: '#cbd5e1',
      fontSize: '1.25rem',
      lineHeight: 1.6,
      opacity: 0.9,
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    topSection: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
    searchContainer: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    aiContainer: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2.5rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minHeight: '500px',
    },
    videoSection: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '2rem',
    },
    videoHeader: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'linear-gradient(to right, #4ade80, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    videoContainer: {
      position: 'relative' as const,
      width: '100%',
      paddingBottom: '56.25%',
      borderRadius: '1rem',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a5c36 0%, #0a2e1a 100%)',
      marginBottom: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    iframe: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none',
    },
    noVideo: {
      padding: '4rem 2rem',
      textAlign: 'center' as const,
      background: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '1rem',
      border: '2px dashed rgba(255, 255, 255, 0.1)',
    },
    placeholderIcon: {
      fontSize: '4rem',
      marginBottom: '1.5rem',
      opacity: 0.7,
      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
    },
    placeholderText: {
      color: '#94a3b8',
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    placeholderSubtext: {
      color: '#64748b',
      fontSize: '1rem',
      marginTop: '0.75rem',
    },
    videoNote: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontSize: '0.875rem',
      color: '#94a3b8',
      padding: '1rem',
      background: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    loadingOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '1rem',
      zIndex: 10,
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(74, 222, 128, 0.3)',
      borderTopColor: '#4ade80',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    footer: {
      marginTop: '4rem',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    footerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1.5rem',
    },
    footerContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1rem',
      width: '100%',
    },
    attribution: {
      textAlign: 'center' as const,
      padding: '0 1rem',
    },
    developer: {
      fontSize: '1rem',
      color: '#cbd5e1',
      marginBottom: '0.5rem',
    },
    developerName: {
      fontWeight: 600,
      color: '#ffffff',
      background: 'linear-gradient(to right, #4ade80, #22d3ee)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    copyright: {
      fontSize: '0.875rem',
      color: '#94a3b8',
    },
    disclaimerContainer: {
      maxWidth: '600px',
      textAlign: 'center' as const,
      padding: '1rem',
      background: 'rgba(15, 23, 42, 0.3)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    disclaimerTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#cbd5e1',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    disclaimerText: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      lineHeight: 1.5,
    },
    separator: {
      height: '1px',
      width: '60px',
      background: 'linear-gradient(to right, transparent, #4ade80, transparent)',
      margin: '0.5rem 0',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={styles.header}>
          <h1 style={styles.title}>FutbolAI - Football Intelligence</h1>
          <p style={styles.subtitle}>
            AI-powered football insights, World Cup 2026 coverage, and expert analysis from Reyes Alamo.
          </p>
        </header>

        <div style={styles.mainGrid}>
          <div style={styles.topSection}>
            <div style={styles.searchContainer}>
              <FootballSearch
                onPlayerSelect={setSelectedPlayer}
                onTeamSelect={setSelectedTeam}
                onVideoFound={setVideoUrl}
                onLoadingChange={setIsLoading}
                onAnalysisUpdate={setAnalysis}
                onTeamsUpdate={setTeams}
                onWorldCupUpdate={setWorldCupInfo}
              />
            </div>
            
            <div style={styles.aiContainer}>
              <FootballAI
                player={selectedPlayer}
                team={selectedTeam}
                isLoading={isLoading}
                analysis={analysis}
                teams={teams}
                worldCupInfo={worldCupInfo}
              />
            </div>
          </div>

          <div style={styles.videoSection}>
            <div style={styles.videoHeader}>
              <span>⚽</span>
              <span>Football Highlights</span>
            </div>
            
            {isLoading ? (
              <div style={{ position: 'relative', minHeight: '200px' }}>
                <div style={styles.videoContainer}>
                  <div style={styles.loadingOverlay}>
                    <div style={styles.loadingSpinner}></div>
                  </div>
                </div>
              </div>
            ) : videoUrl ? (
              <>
                <div style={styles.videoContainer}>
                  <iframe
                    src={videoUrl}
                    title="Football Highlights"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={styles.iframe}
                  ></iframe>
                </div>
                <div style={styles.videoNote}>
                  <span>🔊</span>
                  <span>Click fullscreen for best viewing experience</span>
                </div>
              </>
            ) : selectedPlayer || selectedTeam ? (
              <div style={styles.noVideo}>
                <div style={styles.placeholderIcon}>📺</div>
                <p style={styles.placeholderText}>
                  No highlights available
                </p>
                <p style={styles.placeholderSubtext}>
                  Try searching for another player or team
                </p>
              </div>
            ) : (
              <div style={styles.noVideo}>
                <div style={styles.placeholderIcon}>⚽</div>
                <p style={styles.placeholderText}>
                  Search for a player or team above to see highlights
                </p>
                <p style={styles.placeholderSubtext}>
                  Video highlights will appear here
                </p>
              </div>
            )}
          </div>
          
          <div style={styles.footer}>
            <div style={styles.footerContainer}>
              <div style={styles.footerContent}>
                <div style={styles.attribution}>
                  <p style={styles.developer}>
                    Developed by <span style={styles.developerName}>A. Guillen</span>
                  </p>
                  <div style={styles.separator}></div>
                  <p style={styles.copyright}>
                    © 2025 FutbolAI.org
                  </p>
                </div>
                
                <div style={styles.disclaimerContainer}>
                  <div style={styles.disclaimerTitle}>
                    <span>📽️</span>
                    <span>Content Copyright Notice</span>
                  </div>
                  <p style={styles.disclaimerText}>
                    Football highlights, player images, and team logos are property of their respective owners.
                    All trademarks and registered trademarks are the property of their respective owners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}