'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WorldCup2026() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('fixtures');
  const [selectedTeam, setSelectedTeam] = useState('Argentina');

  const handleTeamClick = (teamName: string) => {
    setSelectedTeam(teamName);
    setActiveSection('teams');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-green-900 text-white shadow-2xl">
        <div className="relative container mx-auto px-4 py-10">
          {/* Back to Home Button */}
          <button
            onClick={() => router.push('/')}
            className="mb-8 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to FutbolAI
          </button>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-5 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-2xl shadow-2xl">
                  <span className="text-5xl">🏆</span>
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    2026 FIFA World Cup
                  </h1>
                  <p className="text-2xl opacity-95">North America • June 11 - July 19, 2026</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                  <div className="text-2xl font-bold">48</div>
                  <div className="text-sm opacity-90">Teams</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                  <div className="text-2xl font-bold">16</div>
                  <div className="text-sm opacity-90">Host Cities</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                  <div className="text-2xl font-bold">104</div>
                  <div className="text-sm opacity-90">Matches</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm opacity-90">Host Countries</div>
                </div>
              </div>
            </div>
            
            <div className="lg:text-right">
              <div className="inline-block p-6 bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-sm font-medium mb-1 opacity-90">Tournament Dates</div>
                <div className="text-3xl font-bold">Jun 11 - Jul 19</div>
                <div className="text-sm opacity-90 mt-2">39 days of football</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveSection('fixtures')}
              className={`px-8 py-5 font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-3 ${
                activeSection === 'fixtures'
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">📅</span>
              <span>Group Stage</span>
            </button>
            <button
              onClick={() => setActiveSection('teams')}
              className={`px-8 py-5 font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-3 ${
                activeSection === 'teams'
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">👥</span>
              <span>Team Rosters</span>
            </button>
            <button
              onClick={() => setActiveSection('venues')}
              className={`px-8 py-5 font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-3 ${
                activeSection === 'venues'
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">🗺️</span>
              <span>Host Cities</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 relative z-10">
        
        {/* FIXTURES SECTION */}
        {activeSection === 'fixtures' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Group Stage Fixtures</h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                Explore the complete match schedule. Click on any team name to dive into their roster and tournament journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Group A */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl mb-6">
                  <h3 className="text-2xl font-bold text-center">Group A</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇺🇸</span>
                      <button 
                        onClick={() => handleTeamClick('USA')}
                        className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        USA
                      </button>
                    </div>
                    <div className="font-bold text-blue-600">0 pts</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇲🇽</span>
                      <button 
                        onClick={() => handleTeamClick('Mexico')}
                        className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        Mexico
                      </button>
                    </div>
                    <div className="font-bold text-blue-600">0 pts</div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <div className="text-gray-500 mb-2">Match 1: Jun 11, 20:00</div>
                    <div className="font-bold text-lg">USA vs Mexico</div>
                    <div className="text-gray-600">MetLife Stadium</div>
                  </div>
                </div>
              </div>

              {/* Group B */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-xl mb-6">
                  <h3 className="text-2xl font-bold text-center">Group B</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇦🇷</span>
                      <button 
                        onClick={() => handleTeamClick('Argentina')}
                        className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        Argentina
                      </button>
                    </div>
                    <div className="font-bold text-blue-600">0 pts</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇧🇷</span>
                      <button 
                        onClick={() => handleTeamClick('Brazil')}
                        className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        Brazil
                      </button>
                    </div>
                    <div className="font-bold text-blue-600">0 pts</div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <div className="text-gray-500 mb-2">Match 1: Jun 12, 18:00</div>
                    <div className="font-bold text-lg">Argentina vs Brazil</div>
                    <div className="text-gray-600">Estadio Azteca</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEAMS SECTION */}
        {activeSection === 'teams' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Team Rosters & Details</h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                {selectedTeam 
                  ? `Exploring ${selectedTeam}'s squad, players, and tournament information`
                  : 'Select a team to explore their complete roster and statistics'
                }
              </p>
            </div>

            {selectedTeam && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-6xl">
                    {selectedTeam === 'Argentina' && '🇦🇷'}
                    {selectedTeam === 'Brazil' && '🇧🇷'}
                    {selectedTeam === 'USA' && '🇺🇸'}
                    {selectedTeam === 'Mexico' && '🇲🇽'}
                    {selectedTeam === 'France' && '🇫🇷'}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">{selectedTeam}</h3>
                    <div className="flex gap-4 mt-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Group {selectedTeam === 'USA' || selectedTeam === 'Mexico' ? 'A' : 'B'}</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">FIFA Rank: #{selectedTeam === 'Argentina' ? '1' : selectedTeam === 'Brazil' ? '3' : '15+'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h4 className="text-xl font-bold mb-4">Key Players</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-bold">Lionel Messi</div>
                          <div className="text-gray-600">Forward • 36 years</div>
                        </div>
                        <div className="text-blue-600 font-medium">Inter Miami</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-bold">Julian Alvarez</div>
                          <div className="text-gray-600">Forward • 24 years</div>
                        </div>
                        <div className="text-blue-600 font-medium">Manchester City</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-4">Team Stats</h4>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="text-sm text-gray-600">World Cup Wins</div>
                        <div className="text-2xl font-bold text-blue-700">
                          {selectedTeam === 'Argentina' ? '3' : selectedTeam === 'Brazil' ? '5' : '0'}
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-sm text-gray-600">Coach</div>
                        <div className="text-xl font-bold text-green-700">
                          {selectedTeam === 'Argentina' ? 'Lionel Scaloni' : selectedTeam === 'Brazil' ? 'Dorival Júnior' : 'To be announced'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VENUES SECTION */}
        {activeSection === 'venues' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Host Cities & Stadiums</h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                {selectedTeam 
                  ? `Venues where ${selectedTeam} will play`
                  : 'Discover the 16 spectacular venues across North America'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Venue 1 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                  <h3 className="text-2xl font-bold text-white">MetLife Stadium</h3>
                  <p className="text-blue-100">New York/New Jersey, USA</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Capacity</div>
                    <div className="text-xl font-bold">82,500</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Matches</div>
                    <div className="text-xl font-bold">6</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Featured Teams</div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedTeam === 'USA' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>USA</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">England</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Portugal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue 2 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                  <h3 className="text-2xl font-bold text-white">Estadio Azteca</h3>
                  <p className="text-green-100">Mexico City, Mexico</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Capacity</div>
                    <div className="text-xl font-bold">87,523</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Matches</div>
                    <div className="text-xl font-bold">5</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Featured Teams</div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedTeam === 'Mexico' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>Mexico</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedTeam === 'Argentina' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>Argentina</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedTeam === 'Brazil' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>Brazil</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue 3 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                  <h3 className="text-2xl font-bold text-white">SoFi Stadium</h3>
                  <p className="text-purple-100">Los Angeles, USA</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Capacity</div>
                    <div className="text-xl font-bold">70,240</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Matches</div>
                    <div className="text-xl font-bold">8</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Featured Teams</div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedTeam === 'USA' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>USA</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">France</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Spain</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}