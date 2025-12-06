// In FootballSearch.tsx, update the team mapping section:
else if (responseType === 'team' && data.teamInfo) {
  console.log('🏟️ Setting team data:', data.teamInfo.name);
  
  const teamData = {
    id: Date.now(),
    name: data.teamInfo.name,
    type: data.teamInfo.type || 'club',
    ranking: data.teamInfo.fifaRanking || data.teamInfo.currentRanking || 'N/A',
    
    // Handle both manager structures
    coach: data.teamInfo.currentManager?.name || 
           data.teamInfo.managerCoach || 
           data.teamInfo.coach || 
           data.teamInfo.currentCoach?.name || 
           'Unknown',
    
    stadium: data.teamInfo.stadium?.name || 
             data.teamInfo.stadium || 
             data.teamInfo.homeStadium || 
             'Unknown',
    
    stadiumCapacity: data.teamInfo.stadium?.capacity || 
                     data.teamInfo.stadiumCapacity || 
                     'Unknown',
    
    league: data.teamInfo.league || 'Unknown',
    founded: data.teamInfo.founded || 'Unknown',
    
    // Handle trophies - new detailed structure
    trophies: data.teamInfo.trophies || data.teamInfo.majorHonors || null,
    achievements: data.teamInfo.achievements || [],
    
    // Handle both keyPlayers structures
    keyPlayers: data.teamInfo.currentSquad?.keyPlayers || 
                data.teamInfo.keyPlayers || 
                [],
    
    mainRivalries: data.teamInfo.mainRivalries || [],
    clubValue: data.teamInfo.clubValue || 'Unknown',
    
    // National team specific
    fifaCode: data.teamInfo.fifaCode,
    confederation: data.teamInfo.confederation,
    playingStyle: data.teamInfo.playingStyle,
    
    // Current season
    currentSeason: data.teamInfo.currentSeason || null
  };
  
  console.log('🏟️ Enhanced team data prepared');
  onTeamSelect(teamData);
}