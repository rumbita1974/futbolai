// Player types
export interface Player {
  name: string;
  position: string;
  age: number;
  dob: string;
  club: string;
  caps: number;
  goals: number;
  photoUrl: string;
  wikipediaUrl: string;
  nationality?: string;
  marketValue?: string;
  preferredFoot?: string;
  height?: string;
  weight?: string;
}

// Team types
export interface Team {
  id: string;
  name: string;
  countryCode: string;
  group: string;
  fifaRanking: number;
  venueCity: string[];
  players: Player[];
  flagUrl?: string;
  summary?: string;
}

// Match types
export interface Match {
  id: string;
  date: string;
  time: string;
  group: string;
  team1: string;
  team2: string;
  venue: string;
  city: string;
  team1Code: string;
  team2Code: string;
}

// Venue types
export interface VenueCity {
  id: string;
  name: string;
  country: string;
  stadium: string;
  capacity: string;
  latitude: number;
  longitude: number;
  matches: number;
  coordinates: { x: number; y: number };
}

// API response types
export interface ApiResponse {
  success: boolean;
  type?: 'player' | 'team' | 'worldcup' | 'club' | 'national';
  playerInfo?: any;
  teamInfo?: any;
  worldCupInfo?: any;
  analysis?: string;
  youtubeUrl?: string;
  error?: string;
  language?: string;
  isSpanish?: boolean;
}

// Context types
export interface TeamContextType {
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  venueCities: string[];
  setVenueCities: (cities: string[]) => void;
  worldCupMatches: Match[];
  setWorldCupMatches: (matches: Match[]) => void;
}

// Search component props
export interface FootballSearchProps {
  onPlayerSelect: (player: any) => void;
  onTeamSelect: (team: any) => void;
  onVideoFound: (url: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onAnalysisUpdate: (analysis: string) => void;
  onTeamsUpdate: (teams: any[]) => void;
  onWorldCupUpdate: (worldCupInfo: any) => void;
}