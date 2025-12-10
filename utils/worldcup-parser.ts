// utils/worldcup-parser.ts

export interface Match {
  id: string;
  date: string;
  time?: string;
  stage: 'group' | 'round32' | 'round16' | 'quarter' | 'semi' | 'bronze' | 'final';
  group?: string;
  team1: string;
  team2: string;
  venue: string;
  city: string;
  status: 'scheduled' | 'completed' | 'live';
}

export interface Team {
  id: string;
  name: string;
  fullName: string;
  countryCode: string;
  group: string;
  fifaRanking: number;
  venueCities: string[];
  flagEmoji: string;
  wikipediaSlug: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  capacity: number;
  matches: string[];
  coordinates: { lat: number; lng: number };
}

// Parse the schedule text
export function parseSchedule(text: string): Match[] {
  const lines = text.split('\n');
  const matches: Match[] = [];
  let currentDate = '';
  let matchId = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line contains a date
    const dateMatch = trimmed.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(\d+\s+\w+\s+\d{4})/);
    if (dateMatch) {
      currentDate = trimmed;
      continue;
    }

    // Parse match line
    const matchRegex = /([^–]+)–\s*(Group\s+([A-L])|.*)?\s*–\s*([^-]+)\s*-\s*([^-]+)$/;
    const match = trimmed.match(matchRegex);
    
    if (match) {
      const [_, teams, groupInfo, groupLetter, venue, city] = match;
      const [team1, team2] = teams.split(' v ').map(t => t.trim());
      
      // Determine stage
      let stage: Match['stage'] = 'group';
      if (groupInfo && groupInfo.includes('Group')) {
        stage = 'group';
      } else if (groupInfo && groupInfo.includes('Round of 32')) {
        stage = 'round32';
      } else if (groupInfo && groupInfo.includes('Round of 16')) {
        stage = 'round16';
      } else if (groupInfo && groupInfo.includes('quarter-final')) {
        stage = 'quarter';
      } else if (groupInfo && groupInfo.includes('semi-final')) {
        stage = 'semi';
      } else if (groupInfo && groupInfo.includes('bronze final')) {
        stage = 'bronze';
      } else if (groupInfo && groupInfo.includes('Final')) {
        stage = 'final';
      }

      matches.push({
        id: `match-${matchId++}`,
        date: currentDate,
        stage,
        group: groupLetter || undefined,
        team1,
        team2,
        venue: venue.trim(),
        city: city.trim(),
        status: 'scheduled'
      });
    }
  }

  return matches;
}

// Extract all unique teams from matches
export function extractTeamsFromMatches(matches: Match[]): Team[] {
  const teamNames = new Set<string>();
  
  matches.forEach(match => {
    if (match.stage === 'group') {
      teamNames.add(match.team1);
      teamNames.add(match.team2);
    }
  });

  const teams: Team[] = Array.from(teamNames).map((name, index) => ({
    id: `team-${index + 1}`,
    name: getShortName(name),
    fullName: name,
    countryCode: getCountryCode(name),
    group: getGroupForTeam(name, matches),
    fifaRanking: 0, // Would need actual data
    venueCities: getVenueCitiesForTeam(name, matches),
    flagEmoji: getFlagEmoji(name),
    wikipediaSlug: getWikipediaSlug(name)
  }));

  return teams;
}

// Helper functions
function getShortName(fullName: string): string {
  const shortNames: Record<string, string> = {
    'Mexico': 'MEX',
    'South Africa': 'RSA',
    'Korea Republic': 'KOR',
    'Czechia/Denmark/North Macedonia/Republic of Ireland': 'TBD',
    'Canada': 'CAN',
    'Bosnia and Herzegovina/Italy/Northern Ireland/Wales': 'TBD',
    'USA': 'USA',
    'Paraguay': 'PAR',
    'Haiti': 'HAI',
    'Scotland': 'SCO',
    'Australia': 'AUS',
    'Kosovo/Romania/Slovakia/Türkiye': 'TBD',
    'Brazil': 'BRA',
    'Morocco': 'MAR',
    'Qatar': 'QAT',
    'Switzerland': 'SUI',
    'Côte d\'Ivoire': 'CIV',
    'Ecuador': 'ECU',
    'Germany': 'GER',
    'Curaçao': 'CUW',
    'Netherlands': 'NED',
    'Japan': 'JPN',
    'Albania/Poland/Sweden/Ukraine': 'TBD',
    'Tunisia': 'TUN',
    'Saudi Arabia': 'KSA',
    'Uruguay': 'URU',
    'Spain': 'ESP',
    'Cabo Verde': 'CPV',
    'IR Iran': 'IRN',
    'New Zealand': 'NZL',
    'Belgium': 'BEL',
    'Egypt': 'EGY',
    'France': 'FRA',
    'Senegal': 'SEN',
    'Bolivia/Iraq/Suriname': 'TBD',
    'Norway': 'NOR',
    'Argentina': 'ARG',
    'Algeria': 'ALG',
    'Austria': 'AUT',
    'Jordan': 'JOR',
    'Ghana': 'GHA',
    'Panama': 'PAN',
    'England': 'ENG',
    'Croatia': 'CRO',
    'Portugal': 'POR',
    'Congo DR/Jamaica/New Caledonia': 'TBD',
    'Uzbekistan': 'UZB',
    'Colombia': 'COL',
  };

  return shortNames[fullName] || fullName.substring(0, 3).toUpperCase();
}

function getCountryCode(name: string): string {
  // Simplified mapping - would need full list
  const codes: Record<string, string> = {
    'Mexico': 'MEX',
    'USA': 'USA',
    'Canada': 'CAN',
    'Brazil': 'BRA',
    'Argentina': 'ARG',
    // Add more...
  };
  return codes[name] || 'UNK';
}

function getGroupForTeam(teamName: string, matches: Match[]): string {
  for (const match of matches) {
    if (match.stage === 'group' && (match.team1 === teamName || match.team2 === teamName)) {
      return match.group || 'Unknown';
    }
  }
  return 'Unknown';
}

function getVenueCitiesForTeam(teamName: string, matches: Match[]): string[] {
  const cities = new Set<string>();
  matches.forEach(match => {
    if (match.stage === 'group' && (match.team1 === teamName || match.team2 === teamName)) {
      cities.add(match.city);
    }
  });
  return Array.from(cities);
}

function getFlagEmoji(country: string): string {
  const emojis: Record<string, string> = {
    'Mexico': '🇲🇽',
    'USA': '🇺🇸',
    'Canada': '🇨🇦',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Spain': '🇪🇸',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Portugal': '🇵🇹',
    'Netherlands': '🇳🇱',
    'Italy': '🇮🇹',
    'Belgium': '🇧🇪',
    // Add more...
  };
  return emojis[country] || '🏴';
}

function getWikipediaSlug(name: string): string {
  // Convert team name to Wikipedia slug format
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}