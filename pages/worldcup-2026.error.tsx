'use client';

import { TeamProvider } from '../context/TeamContext';
import GroupStageFixtures from '../components/GroupStageFixtures';
import TeamDetailsPanel from '../components/TeamDetailsPanel';
import VenueMap from '../components/VenueMap';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WorldCup2026() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('fixtures');

  return (
    <TeamProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-green-900 text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" stroke-width="2"/%3E%3Ccircle cx="50" cy="50" r="20" fill="none" stroke="white" stroke-width="1"/%3E%3C/svg%3E')]"></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-8">
            {/* Back to Home Button */}
            <button
              onClick={() => router.push('/')}
              className="mb-6 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to FutbolAI
            </button>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">2026 FIFA World Cup</h1>
                    <p className="text-xl opacity-90">North America • June 11 - July 19, 2026</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="font-medium">48 Teams</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="font-medium">16 Host Cities</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="font-medium">104 Matches</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="font-medium">3 Host Countries</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:text-right">
                <div className="inline-block p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-xl">
                  <div className="text-sm font-medium mb-1">Tournament Dates</div>
                  <div className="text-2xl font-bold">Jun 11 - Jul 19</div>
                  <div className="text-sm opacity-90">39 days of football</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveSection('fixtures')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeSection === 'fixtures'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                📅 Group Stage Fixtures
              </button>
              <button
                onClick={() => setActiveSection('teams')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeSection === 'teams'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                👥 Team Rosters
              </button>
              <button
                onClick={() => setActiveSection('venues')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeSection === 'venues'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                🗺️ Host Cities & Venues
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeSection === 'about'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                ℹ️ Tournament Info
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Section: Fixtures */}
          {activeSection === 'fixtures' && (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Group Stage Fixtures</h2>
                <p className="text-gray-600 max-w-3xl">
                  Explore the complete match schedule for the 2026 FIFA World Cup. Click on any team name to view their 
                  detailed roster, player information, and the venues where they'll be playing.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <GroupStageFixtures />
                </div>
              </div>
            </div>
          )}

          {/* Section: Teams */}
          {activeSection === 'teams' && (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Team Rosters & Details</h2>
                <p className="text-gray-600 max-w-3xl">
                  Select a team from the fixtures table or browse team information here. View complete rosters with 
                  player statistics, photos from Wikipedia, and detailed team information.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <TeamDetailsPanel />
                </div>
              </div>
            </div>
          )}

          {/* Section: Venues */}
          {activeSection === 'venues' && (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Host Cities & Venues</h2>
                <p className="text-gray-600 max-w-3xl">
                  Explore all 16 host cities across the United States, Canada, and Mexico. The interactive map shows 
                  venues where matches will be played, with green markers indicating venues for the selected team.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <VenueMap />
                </div>
              </div>
            </div>
          )}

          {/* Section: About */}
          {activeSection === 'about' && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Tournament Info */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">2026 FIFA World Cup Overview</h2>
                    
                    <div className="prose prose-lg max-w-none">
                      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Historic Expansion</h3>
                        <p className="text-gray-700">
                          The 2026 FIFA World Cup will be the first tournament featuring 48 teams, expanded from 32. 
                          This marks the largest World Cup in history, with matches spread across 16 cities in three 
                          host countries: United States, Canada, and Mexico.
                        </p>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Tournament Format</h3>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span><strong>48 teams</strong> in 12 groups of 4 teams each</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span><strong>Top 2 teams</strong> from each group advance to knockout stage</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span><strong>Round of 32</strong> - New knockout round due to expansion</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span><strong>104 total matches</strong> (increased from 64)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span><strong>39-day tournament</strong> (June 11 - July 19, 2026)</span>
                        </li>
                      </ul>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Host Countries</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                          <div className="text-3xl mb-2">🇺🇸</div>
                          <h4 className="font-bold text-gray-800 mb-2">United States</h4>
                          <p className="text-sm text-gray-600">11 host cities, including the final at MetLife Stadium</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                          <div className="text-3xl mb-2">🇨🇦</div>
                          <h4 className="font-bold text-gray-800 mb-2">Canada</h4>
                          <p className="text-sm text-gray-600">2 host cities: Toronto and Vancouver</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                          <div className="text-3xl mb-2">🇲🇽</div>
                          <h4 className="font-bold text-gray-800 mb-2">Mexico</h4>
                          <p className="text-sm text-gray-600">3 host cities, including historic Estadio Azteca</p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Key Innovations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <h4 className="font-bold text-gray-700 mb-2">🔄 New Match Schedule</h4>
                          <p className="text-sm text-gray-600">Extended tournament with more rest days between matches</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <h4 className="font-bold text-gray-700 mb-2">🌍 Global Accessibility</h4>
                          <p className="text-sm text-gray-600">Matches across multiple time zones for global audience</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Quick Facts */}
                <div className="space-y-8">
                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Teams:</span>
                        <span className="font-bold">48 (+16)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Matches:</span>
                        <span className="font-bold">104 (+40)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Host Cities:</span>
                        <span className="font-bold">16</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Host Countries:</span>
                        <span className="font-bold">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Duration:</span>
                        <span className="font-bold">39 days</span>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-sm opacity-90">*Numbers in parentheses show increase from 2022</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Important Dates */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Important Dates</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Opening Match</span>
                        <span className="font-bold text-blue-600">Jun 11, 2026</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Group Stage Ends</span>
                        <span className="font-bold text-green-600">Jun 30, 2026</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-gray-700">Round of 32</span>
                        <span className="font-bold text-yellow-600">Jul 1-4, 2026</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Final Match</span>
                        <span className="font-bold text-purple-600">Jul 19, 2026</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* How to Use */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">How to Use This Page</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          1
                        </div>
                        <p className="text-sm text-gray-600">
                          Click on any team name in the fixtures to view their roster
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          2
                        </div>
                        <p className="text-sm text-gray-600">
                          Explore player details and Wikipedia links
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                        <p className="text-sm text-gray-600">
                          See highlighted venues on the map for selected teams
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">2026 FIFA World Cup</h3>
                <p className="text-gray-300 text-sm">
                  Interactive guide to the expanded 48-team tournament hosted across North America.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Interactive group stage fixtures</li>
                  <li>• Team rosters with Wikipedia integration</li>
                  <li>• Venue maps with team highlighting</li>
                  <li>• Player statistics and photos</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Data Sources</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• FIFA Official Information</p>
                  <p>• Wikipedia Player Data</p>
                  <p>• Team and Venue Information</p>
                  <p className="mt-4 text-xs text-gray-400">
                    This is a fan-made project. All data is for informational purposes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} FutbolAI Explorer • Part of the FutbolAI platform
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>←</span>
                <span>Back to Main FutbolAI</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </TeamProvider>
  );
}