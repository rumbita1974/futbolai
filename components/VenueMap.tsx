'use client';

import { useTeam } from '@/context/TeamContext';
import { useState } from 'react';

interface City {
  id: string;
  name: string;
  country: string;
  stadium: string;
  capacity: string;
  latitude: number;
  longitude: number;
  matches: number;
  coordinates: { x: number; y: number }; // For static positioning on the image
}

const VENUE_CITIES: City[] = [
  {
    id: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    stadium: 'Estadio Azteca',
    capacity: '87,523',
    latitude: 19.3028,
    longitude: -99.1503,
    matches: 5,
    coordinates: { x: 15, y: 40 } // Position on the map image
  },
  {
    id: 'guadalajara',
    name: 'Guadalajara',
    country: 'Mexico',
    stadium: 'Estadio Akron',
    capacity: '48,071',
    latitude: 20.6667,
    longitude: -103.3333,
    matches: 4,
    coordinates: { x: 10, y: 35 }
  },
  {
    id: 'monterrey',
    name: 'Monterrey',
    country: 'Mexico',
    stadium: 'Estadio BBVA',
    capacity: '53,500',
    latitude: 25.6667,
    longitude: -100.3167,
    matches: 4,
    coordinates: { x: 20, y: 32 }
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    country: 'Canada',
    stadium: 'BC Place',
    capacity: '54,500',
    latitude: 49.2500,
    longitude: -123.1000,
    matches: 7,
    coordinates: { x: 12, y: 12 }
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    stadium: 'BMO Field',
    capacity: '45,500',
    latitude: 43.6333,
    longitude: -79.4167,
    matches: 6,
    coordinates: { x: 35, y: 20 }
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'USA',
    stadium: 'SoFi Stadium',
    capacity: '70,240',
    latitude: 33.9533,
    longitude: -118.3389,
    matches: 8,
    coordinates: { x: 8, y: 30 }
  },
  {
    id: 'new-york',
    name: 'New York/New Jersey',
    country: 'USA',
    stadium: 'MetLife Stadium',
    capacity: '82,500',
    latitude: 40.8136,
    longitude: -74.0744,
    matches: 8,
    coordinates: { x: 45, y: 22 }
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'USA',
    stadium: 'Hard Rock Stadium',
    capacity: '64,767',
    latitude: 25.9581,
    longitude: -80.2389,
    matches: 7,
    coordinates: { x: 40, y: 40 }
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    country: 'USA',
    stadium: 'Mercedes-Benz Stadium',
    capacity: '71,000',
    latitude: 33.7553,
    longitude: -84.4008,
    matches: 8,
    coordinates: { x: 35, y: 35 }
  },
  {
    id: 'seattle',
    name: 'Seattle',
    country: 'USA',
    stadium: 'Lumen Field',
    capacity: '69,000',
    latitude: 47.5952,
    longitude: -122.3316,
    matches: 6,
    coordinates: { x: 10, y: 15 }
  },
  {
    id: 'boston',
    name: 'Boston',
    country: 'USA',
    stadium: 'Gillette Stadium',
    capacity: '65,878',
    latitude: 42.0909,
    longitude: -71.2643,
    matches: 7,
    coordinates: { x: 50, y: 20 }
  },
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    country: 'USA',
    stadium: 'Lincoln Financial Field',
    capacity: '69,796',
    latitude: 39.9008,
    longitude: -75.1675,
    matches: 6,
    coordinates: { x: 42, y: 25 }
  },
  {
    id: 'houston',
    name: 'Houston',
    country: 'USA',
    stadium: 'NRG Stadium',
    capacity: '72,220',
    latitude: 29.6847,
    longitude: -95.4108,
    matches: 7,
    coordinates: { x: 30, y: 38 }
  },
  {
    id: 'kansas-city',
    name: 'Kansas City',
    country: 'USA',
    stadium: 'Arrowhead Stadium',
    capacity: '76,416',
    latitude: 39.0489,
    longitude: -94.4839,
    matches: 6,
    coordinates: { x: 32, y: 30 }
  },
  {
    id: 'dallas',
    name: 'Dallas',
    country: 'USA',
    stadium: 'AT&T Stadium',
    capacity: '80,000',
    latitude: 32.7473,
    longitude: -97.0945,
    matches: 9,
    coordinates: { x: 28, y: 35 }
  },
  {
    id: 'san-francisco',
    name: 'San Francisco Bay Area',
    country: 'USA',
    stadium: "Levi's Stadium",
    capacity: '68,500',
    latitude: 37.4030,
    longitude: -121.9700,
    matches: 6,
    coordinates: { x: 8, y: 25 }
  }
];

export default function VenueMap() {
  const { venueCities, selectedTeam } = useTeam();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [mapImageError, setMapImageError] = useState(false);
  const [filterCountry, setFilterCountry] = useState<string>('All');

  // Calculate highlighted cities based on selected team
  const highlightedCities = selectedTeam 
    ? VENUE_CITIES.filter(city => venueCities.includes(city.name))
    : [];

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    
    // Scroll to city details
    setTimeout(() => {
      const cityDetails = document.getElementById('city-details');
      if (cityDetails) {
        cityDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Filter by country
  const countries = ['All', 'USA', 'Canada', 'Mexico'];
  const filteredCities = filterCountry === 'All' 
    ? VENUE_CITIES 
    : VENUE_CITIES.filter(city => city.country === filterCountry);

  // Get country flag emoji
  const getCountryEmoji = (country: string) => {
    switch (country) {
      case 'USA': return '🇺🇸';
      case 'Canada': return '🇨🇦';
      case 'Mexico': return '🇲🇽';
      default: return '🏴';
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
        {/* Map Image */}
        <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {mapImageError ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-lg font-medium text-gray-700 mb-2">Interactive Map</p>
                <p className="text-gray-500 max-w-md">
                  Click on the city markers below to view venue details and see highlighted cities for selected teams.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Map Background with fallback */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 opacity-30"></div>
              
              {/* North America Outline */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-4/5 h-4/5">
                  {/* Simplified map shapes */}
                  <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300 opacity-50"></div>
                  <div className="absolute top-1/3 left-1/3 w-1/4 h-1/4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 opacity-50"></div>
                  <div className="absolute top-2/3 left-1/4 w-1/6 h-1/6 bg-gradient-to-br from-red-100 to-red-200 rounded-lg border-2 border-red-300 opacity-50"></div>
                  
                  {/* City Markers Overlay */}
                  <div className="absolute inset-0">
                    {VENUE_CITIES.map((city) => {
                      const isHighlighted = highlightedCities.some(hc => hc.id === city.id);
                      const isSelected = selectedCity?.id === city.id;
                      
                      return (
                        <button
                          key={city.id}
                          onClick={() => handleCityClick(city)}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                            isHighlighted ? 'z-20' : 'z-10'
                          }`}
                          style={{
                            left: `${city.coordinates.x}%`,
                            top: `${city.coordinates.y}%`
                          }}
                        >
                          <div className="relative group">
                            {/* Marker */}
                            <div className={`
                              w-8 h-8 rounded-full border-4 shadow-xl transform transition-all duration-300
                              ${isHighlighted 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-white scale-125 animate-pulse-dot' 
                                : isSelected
                                ? 'bg-gradient-to-br from-blue-600 to-blue-500 border-white scale-110'
                                : 'bg-gradient-to-br from-blue-500 to-blue-400 border-white group-hover:scale-110'
                              }
                            `}>
                              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                                {getCountryEmoji(city.country).charAt(0)}
                              </div>
                            </div>
                            
                            {/* City Name Label */}
                            <div className={`
                              absolute left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 rounded-lg shadow-xl
                              bg-white border border-gray-200 min-w-[120px] text-center
                              transition-all duration-300 pointer-events-none
                              ${isSelected ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}
                            `}>
                              <div className="font-bold text-gray-800 text-sm">{city.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{city.stadium}</div>
                              <div className="text-xs text-gray-400">{city.matches} matches</div>
                            </div>
                            
                            {/* Tooltip arrow */}
                            <div className={`
                              absolute left-1/2 transform -translate-x-1/2 -bottom-1
                              w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45
                              transition-all duration-300 pointer-events-none
                              ${isSelected ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}
                            `}></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-300">
                <h4 className="font-bold text-gray-700 mb-3">Map Legend</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full border-2 border-white"></div>
                    <span className="text-sm text-gray-600">Host City</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-2 border-white animate-pulse-dot"></div>
                    <span className="text-sm text-gray-600">Selected Team Venue</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full border-2 border-white"></div>
                    <span className="text-sm text-gray-600">Selected City</span>
                  </div>
                </div>
              </div>
              
              {/* Country Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <span className="font-medium text-gray-700">USA</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                      {VENUE_CITIES.filter(c => c.country === 'USA').length}
                    </span>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇨🇦</span>
                    <span className="font-medium text-gray-700">Canada</span>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                      {VENUE_CITIES.filter(c => c.country === 'Canada').length}
                    </span>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇲🇽</span>
                    <span className="font-medium text-gray-700">Mexico</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                      {VENUE_CITIES.filter(c => c.country === 'Mexico').length}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Country Filter */}
      <div className="flex flex-wrap gap-2">
        {countries.map(country => (
          <button
            key={country}
            onClick={() => setFilterCountry(country)}
            className={`
              px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
              ${filterCountry === country
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
              }
            `}
          >
            {country !== 'All' && <span>{getCountryEmoji(country)}</span>}
            <span>{country === 'All' ? 'All Host Countries' : country}</span>
          </button>
        ))}
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map(city => {
          const isHighlighted = highlightedCities.some(hc => hc.id === city.id);
          const isSelected = selectedCity?.id === city.id;
          
          return (
            <div
              key={city.id}
              onClick={() => handleCityClick(city)}
              className={`
                p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                ${isSelected ? 'border-blue-500 bg-blue-50 transform scale-102' : 'border-gray-200 hover:border-gray-300'}
                ${isHighlighted ? 'ring-2 ring-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50' : 'bg-white'}
                hover:shadow-lg
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getCountryEmoji(city.country)}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700">{city.name}</h3>
                    <p className="text-sm text-gray-500">{city.country}</p>
                  </div>
                </div>
                {isHighlighted && (
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
                    Team Venue
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Stadium:</span>
                  <span className="font-medium text-gray-800 text-right">{city.stadium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Capacity:</span>
                  <span className="font-bold text-blue-600">{city.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Matches:</span>
                  <span className="font-bold text-green-600">{city.matches}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Click to view details</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">📍 View</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected City Details */}
      {selectedCity && (
        <div id="city-details" className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-blue-300 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{getCountryEmoji(selectedCity.country)}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedCity.stadium}</h3>
                  <p className="text-gray-600">{selectedCity.name}, {selectedCity.country}</p>
                </div>
              </div>
              <p className="text-gray-700">
                One of the premier venues for the 2026 FIFA World Cup, hosting {selectedCity.matches} matches during the tournament.
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-700">{selectedCity.capacity}</div>
              <div className="text-sm text-gray-500">Stadium Capacity</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
              <div className="text-sm text-gray-500">Matches Scheduled</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">{selectedCity.matches}</div>
              <div className="text-xs text-blue-500 mt-1">Group stage to knockout</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-green-200 shadow-sm">
              <div className="text-sm text-gray-500">Host Country</div>
              <div className="text-xl font-bold text-gray-800 mt-2 flex items-center justify-center gap-2">
                <span>{getCountryEmoji(selectedCity.country)}</span>
                <span>{selectedCity.country}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Co-host nation</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-yellow-200 shadow-sm">
              <div className="text-sm text-gray-500">Geographic Location</div>
              <div className="text-sm font-medium text-gray-800 mt-2">
                {selectedCity.latitude.toFixed(2)}° N, {selectedCity.longitude.toFixed(2)}° W
              </div>
              <div className="text-xs text-gray-500 mt-1">Coordinates</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
              <div className="text-sm text-gray-500">Venue Type</div>
              <div className="text-sm font-medium text-gray-800 mt-2">Football Stadium</div>
              <div className="text-xs text-gray-500 mt-1">Modern facilities</div>
            </div>
          </div>
          
          {selectedTeam && highlightedCities.some(hc => hc.id === selectedCity.id) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Team Match Venue</h4>
                  <p className="text-green-700">
                    {selectedTeam.name} will play matches at this venue during the tournament.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-700 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border">
                <h5 className="font-medium text-gray-700 mb-2">Tournament Significance</h5>
                <p className="text-sm text-gray-600">
                  This venue will host crucial matches throughout the tournament, including potential knockout stage games.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h5 className="font-medium text-gray-700 mb-2">Fan Experience</h5>
                <p className="text-sm text-gray-600">
                  Modern amenities, excellent sightlines, and easy accessibility make this a top venue for fans.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Facts */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-300">
        <h4 className="font-bold text-gray-800 mb-4">2026 World Cup Venue Facts</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">16</div>
            <div className="text-sm text-gray-600">Total host cities across 3 countries</div>
          </div>
          <div className="p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">104</div>
            <div className="text-sm text-gray-600">Matches to be played across all venues</div>
          </div>
          <div className="p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Host countries working together</div>
          </div>
        </div>
      </div>
    </div>
  );
}