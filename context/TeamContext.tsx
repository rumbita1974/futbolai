'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Player interface
interface Player {
  name: string;
  position: string;
  age: number;
  dob: string;
  club: string;
  caps: number;
  goals: number;
  photoUrl: string;
  wikipediaUrl: string;
}

// Define the Team interface
interface Team {
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

// Define the Match interface
interface Match {
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

// Define the context type
interface TeamContextType {
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  venueCities: string[];
  setVenueCities: (cities: string[]) => void;
  worldCupMatches: Match[];
  setWorldCupMatches: (matches: Match[]) => void;
}

// Create the context with a default value
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Define the provider component
export function TeamProvider({ children }: { children: ReactNode }) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [venueCities, setVenueCities] = useState<string[]>([]);
  const [worldCupMatches, setWorldCupMatches] = useState<Match[]>([
    {
      id: "1",
      date: "2026-06-11",
      time: "20:00",
      group: "A",
      team1: "United States",
      team2: "Canada",
      venue: "Estadio Azteca",
      city: "Mexico City",
      team1Code: "US",
      team2Code: "CA"
    },
    {
      id: "2",
      date: "2026-06-12",
      time: "14:00",
      group: "A",
      team1: "Argentina",
      team2: "Chile",
      venue: "MetLife Stadium",
      city: "New York/New Jersey",
      team1Code: "AR",
      team2Code: "CL"
    }
  ]);

  return (
    <TeamContext.Provider value={{
      selectedTeam,
      setSelectedTeam,
      loading,
      setLoading,
      venueCities,
      setVenueCities,
      worldCupMatches,
      setWorldCupMatches
    }}>
      {children}
    </TeamContext.Provider>
  );
}

// Define the hook to use the context
export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}