'use client';

import { useTeam } from '@/context/TeamContext';
import { useEffect, useState } from 'react';

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

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Team data for the 2026 World Cup
const TEAMS_DATA: Record<string, any> = {
  "Argentina": {
    id: "argentina",
    name: "Argentina",
    countryCode: "AR",
    group: "A",
    fifaRanking: 1,
    venueCity: ["New York/New Jersey", "Miami", "Boston"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/ar.png",
    summary: "Defending champions, led by Lionel Messi"
  },
  "United States": {
    id: "usa",
    name: "United States",
    countryCode: "US",
    group: "A",
    fifaRanking: 11,
    venueCity: ["Los Angeles", "Seattle", "Boston", "Kansas City", "Atlanta", "Philadelphia"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/us.png",
    summary: "Co-hosts, emerging football nation"
  },
  "Canada": {
    id: "canada",
    name: "Canada",
    countryCode: "CA",
    group: "A",
    fifaRanking: 45,
    venueCity: ["Toronto", "Vancouver"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/ca.png",
    summary: "Co-hosts, improving national team"
  },
  "Brazil": {
    id: "brazil",
    name: "Brazil",
    countryCode: "BR",
    group: "B",
    fifaRanking: 5,
    venueCity: ["Miami", "Atlanta", "Los Angeles"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/br.png",
    summary: "5-time champions, always favorites"
  },
  "Germany": {
    id: "germany",
    name: "Germany",
    countryCode: "DE",
    group: "B",
    fifaRanking: 16,
    venueCity: ["Philadelphia", "Toronto", "New York/New Jersey"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/de.png",
    summary: "4-time champions, rebuilding phase"
  },
  "France": {
    id: "france",
    name: "France",
    countryCode: "FR",
    group: "C",
    fifaRanking: 2,
    venueCity: ["Miami", "Atlanta", "Houston"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/fr.png",
    summary: "2018 champions, stacked squad"
  },
  "Spain": {
    id: "spain",
    name: "Spain",
    countryCode: "ES",
    group: "C",
    fifaRanking: 8,
    venueCity: ["Boston", "New York/New Jersey", "Philadelphia"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/es.png",
    summary: "2010 champions, technical masters"
  },
  "England": {
    id: "england",
    name: "England",
    countryCode: "GB-ENG",
    group: "D",
    fifaRanking: 3,
    venueCity: ["Los Angeles", "Seattle", "San Francisco Bay Area"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/gb-eng.png",
    summary: "1966 champions, strong young team"
  },
  "Portugal": {
    id: "portugal",
    name: "Portugal",
    countryCode: "PT",
    group: "D",
    fifaRanking: 6,
    venueCity: ["New York/New Jersey", "Boston", "Philadelphia"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/pt.png",
    summary: "Led by Cristiano Ronaldo, European champions"
  },
  "Italy": {
    id: "italy",
    name: "Italy",
    countryCode: "IT",
    group: "E",
    fifaRanking: 9,
    venueCity: ["Miami", "Atlanta", "Dallas"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/it.png",
    summary: "4-time champions, missed 2022"
  },
  "Netherlands": {
    id: "netherlands",
    name: "Netherlands",
    countryCode: "NL",
    group: "E",
    fifaRanking: 7,
    venueCity: ["Seattle", "Vancouver", "Toronto"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/nl.png",
    summary: "Total football, always contenders"
  },
  "Mexico": {
    id: "mexico",
    name: "Mexico",
    countryCode: "MX",
    group: "F",
    fifaRanking: 12,
    venueCity: ["Mexico City", "Guadalajara", "Monterrey", "Los Angeles"],
    players: [],
    flagUrl: "https://flagcdn.com/w320/mx.png",
    summary: "Co-hosts, passionate fan base"
  }
};

export default function GroupStageFixtures() {
  const { setSelectedTeam, setVenueCities, worldCupMatches } = useTeam();
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Use the matches from context (could be parsed from your schedule file)
    setMatches(worldCupMatches);
  }, [worldCupMatches]);

  const handleTeamClick = (teamName: string) => {
    const teamData = TEAMS_DATA[teamName as keyof typeof TEAMS_DATA];
    if (teamData) {
      setSelectedTeam(teamData);
      setVenueCities(teamData.venueCity);
      
      // Scroll to team details panel
      setTimeout(() => {
        const teamPanel = document.getElementById('team-details-panel');
        if (teamPanel) {
          teamPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const filteredMatches = matches.filter(match => match.group === selectedGroup);

  // Get unique groups from matches
  const availableGroups = [...new Set(matches.map(match => match.group))].sort();

  return (
    <div>
      {/* Tournament Overview */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Tournament Format</h3>
            <p className="text-sm text-gray-600">
              48 teams in 12 groups of 4 • Top 2 from each group advance • Round of 32 knockout stage
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-white px-3 py-2 rounded-lg border">
              <div className="text-xs text-gray-500">Matches</div>
              <div className="font-bold text-blue-600">104</div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border">
              <div className="text-xs text-gray-500">Venues</div>
              <div className="font-bold text-green-600">16</div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border">
              <div className="text-xs text-gray-500">Duration</div>
              <div className="font-bold text-purple-600">39 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Select Group</h3>
          <span className="text-sm text-gray-500">
            Showing {filteredMatches.length} matches
          </span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {GROUPS.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`
                py-3 rounded-lg font-medium transition-all duration-300
                ${selectedGroup === group
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }
                ${availableGroups.includes(group) ? '' : 'opacity-40 cursor-not-allowed'}
              `}
              disabled={!availableGroups.includes(group)}
            >
              <div className="text-sm font-bold">GROUP</div>
              <div className="text-xl font-black">{group}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-green-50">
                <th className="py-4 px-4 text-left text-gray-600 font-semibold text-sm">
                  <div>Date & Time</div>
                  <div className="font-normal text-xs text-gray-500">(Local Time)</div>
                </th>
                <th className="py-4 px-4 text-left text-gray-600 font-semibold">Match</th>
                <th className="py-4 px-4 text-left text-gray-600 font-semibold">Venue</th>
                <th className="py-4 px-4 text-left text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match, index) => (
                  <tr 
                    key={match.id} 
                    className={`border-b hover:bg-blue-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{match.date}</div>
                      <div className="text-sm text-gray-500">{match.time}</div>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Group {match.group}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-6 flex-shrink-0">
                            <img
                              src={`https://flagcdn.com/w40/${match.team1Code.toLowerCase()}.png`}
                              alt={match.team1}
                              className="w-full h-full object-cover rounded shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/40x30/cccccc/666666?text=${match.team1Code}`;
                              }}
                            />
                          </div>
                          <button
                            onClick={() => handleTeamClick(match.team1)}
                            className="text-left font-medium text-blue-700 hover:text-blue-900 hover:underline transition-colors text-lg"
                          >
                            {match.team1}
                          </button>
                        </div>
                        <div className="text-center text-gray-400 font-bold text-sm">VS</div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-6 flex-shrink-0">
                            <img
                              src={`https://flagcdn.com/w40/${match.team2Code.toLowerCase()}.png`}
                              alt={match.team2}
                              className="w-full h-full object-cover rounded shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/40x30/cccccc/666666?text=${match.team2Code}`;
                              }}
                            />
                          </div>
                          <button
                            onClick={() => handleTeamClick(match.team2)}
                            className="text-left font-medium text-blue-700 hover:text-blue-900 hover:underline transition-colors text-lg"
                          >
                            {match.team2}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{match.venue}</div>
                      <div className="text-sm text-gray-600 mt-1">{match.city}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleTeamClick(match.team1)}
                          className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          View {match.team1}
                        </button>
                        <button
                          onClick={() => handleTeamClick(match.team2)}
                          className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          View {match.team2}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 px-4 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-4">📅</div>
                      <p className="text-lg font-medium mb-2">No matches scheduled yet</p>
                      <p className="text-sm">Match schedule will be updated as the tournament approaches</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Click on team names</span> to view detailed roster, player information, and venue details.
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Clickable team</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-dot"></div>
                <span className="text-sm text-gray-600">Selected team venue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Groups Summary */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Group Stage Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['A', 'B', 'C', 'D'].map(group => {
            const groupTeams = Object.values(TEAMS_DATA).filter(team => team.group === group);
            return (
              <div key={group} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-800">Group {group}</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                    {groupTeams.length} teams
                  </span>
                </div>
                <div className="space-y-2">
                  {groupTeams.map(team => (
                    <div key={team.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={team.flagUrl}
                          alt={`${team.name} flag`}
                          className="w-6 h-4 object-cover rounded"
                        />
                        <span className="text-sm font-medium">{team.name}</span>
                      </div>
                      <button
                        onClick={() => handleTeamClick(team.name)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}